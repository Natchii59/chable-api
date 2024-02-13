import { BadRequestException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { ChannelType } from '@prisma/client'
import {
  AccessGuard,
  Actions,
  CaslSubject,
  SubjectProxy,
  UseAbility
} from 'nest-casl'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { ChannelsService } from '@/channels/channels.service'
import {
  CreateChannelArgs,
  DeleteChannelArgs,
  UpdateChannelArgs
} from '@/channels/dto/channels-mutations.dto'
import { Channel } from '@/channels/models/channel.model'
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
  @UseAbility(Actions.update, Channel, ChannelHook)
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
  @UseAbility(Actions.delete, Channel, ChannelHook)
  deleteChannel(@Args() args: DeleteChannelArgs) {
    return this.channelsService.deleteChannel(args.id)
  }
}
