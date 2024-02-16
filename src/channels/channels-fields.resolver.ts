import {
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
  Resolver
} from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { ChannelsService } from '@/channels/channels.service'
import {
  FindManyChannelsArgs,
  FindManyChannelsObject
} from '@/channels/dto/channels-queries.dto'
import { Channel } from '@/channels/models/channel.model'
import { Dataloaders } from '@/dataloader/dataloader.interface'
import { ParentArgs } from '@/lib/decorators/parent-args.decorator'
import { FindManyMessageArgs } from '@/messages/dto/messages-queries.dto'
import { Message } from '@/messages/models/message.model'
import { FindManyUserArgs } from '@/users/dto/users-queries.dto'
import { User } from '@/users/models/user.model'

import { JwtPayload } from 'types/auth'

@Resolver(() => Channel)
export class ChannelsFieldsResolver {
  constructor() {}

  @ResolveField(() => User, { nullable: true })
  owner(@Parent() channel: Channel, @Context('loaders') loaders: Dataloaders) {
    if (!channel.ownerId) return null

    return loaders.channels.ownerLoader.load(channel.ownerId)
  }

  @ResolveField(() => [User])
  users(
    @Parent() channel: Channel,
    @Args() args: FindManyUserArgs,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.channels.usersLoader.load({
      channelId: channel.id,
      args
    })
  }

  @ResolveField(() => [Message], { nullable: true })
  async messages(
    @Parent() channel: Channel,
    @Args() args: FindManyMessageArgs,
    @Context('loaders') loaders: Dataloaders,
    @CurrentUser() payload: JwtPayload
  ) {
    const users = await loaders.channels.usersLoader.load({
      channelId: channel.id,
      args: {
        where: { id: payload.userId }
      }
    })

    if (!users.length) return null

    return loaders.channels.messagesLoader.load({
      channelId: channel.id,
      args
    })
  }

  @ResolveField(() => Message, { nullable: true })
  lastMessage(
    @Parent() channel: Channel,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.channels.lastMessageLoader.load(channel.id)
  }

  @ResolveField(() => Int)
  unreadMessages(
    @Parent() channel: Channel,
    @Context('loaders') loaders: Dataloaders,
    @CurrentUser() payload: JwtPayload
  ) {
    return loaders.channels.unreadMessagesLoader.load({
      channelId: channel.id,
      currentUserId: payload.userId
    })
  }
}

@Resolver(() => FindManyChannelsObject)
export class FindChannelsFieldsResolver {
  constructor(private channelsService: ChannelsService) {}

  @ResolveField(() => Int)
  count(
    @ParentArgs() parentArgs: FindManyChannelsArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    return this.channelsService.countChannels(parentArgs.where, payload.userId)
  }
}
