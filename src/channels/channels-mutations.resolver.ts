import { BadRequestException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'
import { AccessGuard, CaslSubject, SubjectProxy, UseAbility } from 'nest-casl'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { ChannelsService } from '@/channels/channels.service'
import {
  CreateChannelArgs,
  DeleteChannelArgs,
  JoinLeaveChannelArgs,
  ReadChannelArgs,
  UpdateChannelArgs
} from '@/channels/dto/channels-mutations.dto'
import { Channel } from '@/channels/models/channel.model'
import { ChannelActions } from '@/channels/permissions/channels.actions'
import { ChannelHook } from '@/channels/permissions/channels.hooks'

import { JwtPayload } from 'types/auth'

@Resolver()
export class ChannelsMutationsResolver {
  constructor(private channelsService: ChannelsService) {}

  @Mutation(() => Channel, { nullable: true })
  createChannel(
    @Args() args: CreateChannelArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    return this.channelsService.createChannel(args.data, payload.userId)
  }

  @Mutation(() => Channel, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(ChannelActions.update, Channel, ChannelHook)
  async updateChannel(
    @Args() args: UpdateChannelArgs,
    @CaslSubject() subjectProxy: SubjectProxy<Channel>
  ) {
    const channel = await subjectProxy.get()

    switch (channel.type) {
      case ChannelType.GROUP:
        if (typeof args.data.description === 'string') {
          throw new BadRequestException(
            'Cannot update description of group channel'
          )
        }
        break
      case ChannelType.PUBLIC:
        if (args.data.name === null) {
          throw new BadRequestException('Cannot remove name of public channel')
        }
        break
    }

    return this.channelsService.updateChannel(args.id, args.data)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(ChannelActions.delete, Channel, ChannelHook)
  async deleteChannel(@Args() args: DeleteChannelArgs) {
    await this.channelsService.deleteChannel(args.id)
    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(ChannelActions.join, Channel, ChannelHook)
  async joinChannel(
    @Args() args: JoinLeaveChannelArgs,
    @CaslSubject()
    subjectProxy: SubjectProxy<Channel & { users: { id: string }[] }>,
    @CurrentUser() payload: JwtPayload
  ) {
    const channel = await subjectProxy.get()

    const userIds = args.userIds?.length ? args.userIds : [payload.userId]

    switch (channel.type) {
      case 'PUBLIC':
        if (userIds.some(id => id !== payload.userId)) {
          throw new BadRequestException(
            'Cannot add other users to public channel'
          )
        }
        break
      case 'GROUP':
        if (channel.users.some(user => userIds.includes(user.id))) {
          throw new BadRequestException('An user is already in the group')
        }
    }

    await this.channelsService.joinChannel(args.id, userIds)

    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(ChannelActions.leave, Channel, ChannelHook)
  async leaveChannel(
    @Args() args: JoinLeaveChannelArgs,
    @CaslSubject()
    subjectProxy: SubjectProxy<Channel & { users: { id: string }[] }>,
    @CurrentUser() payload: JwtPayload
  ) {
    const channel = await subjectProxy.get()

    const userIds = args.userIds?.length ? args.userIds : [payload.userId]

    switch (channel.type) {
      case 'PUBLIC':
      case 'GROUP':
        if (!channel.users.some(user => userIds.includes(user.id))) {
          throw new BadRequestException('An user is not in the channel')
        } else if (
          channel.ownerId !== payload.userId &&
          userIds.some(id => id !== payload.userId)
        ) {
          throw new BadRequestException(
            'Cannot remove other users from the channel'
          )
        } else if (
          channel.ownerId === payload.userId &&
          userIds.some(id => id === payload.userId)
        ) {
          throw new BadRequestException('Cannot remove owner from the channel')
        }
        break
    }

    await this.channelsService.leaveChannel(args.id, userIds)

    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(ChannelActions.read, Channel, ChannelHook)
  async readChannel(
    @Args() args: ReadChannelArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    await this.channelsService.readChannel(args.id, payload.userId)
    return true
  }
}
