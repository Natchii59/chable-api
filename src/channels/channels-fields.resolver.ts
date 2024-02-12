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
import { FindManyUserArgs } from '@/users/dto/users-queries.dto'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'

import { JwtPayload } from 'types/auth'

@Resolver(() => Channel)
export class ChannelsFieldsResolver {
  constructor(private usersService: UsersService) {}

  @ResolveField(() => User, { nullable: true })
  owner(@Parent() channel: Channel) {
    if (!channel.ownerId) {
      return null
    }

    return this.usersService.getUser({ id: channel.ownerId })
  }

  @ResolveField(() => [User], { nullable: true })
  users(
    @Parent() channel: Channel,
    @Args() args: FindManyUserArgs,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.channelsUsersLoader.load({
      channelId: channel.id,
      args
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
