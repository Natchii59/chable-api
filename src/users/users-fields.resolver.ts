import {
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
  Resolver
} from '@nestjs/graphql'

import { FindManyChannelsArgs } from '@/channels/dto/channels-queries.dto'
import { Channel } from '@/channels/models/channel.model'
import { Dataloaders } from '@/dataloader/dataloader.interface'
import { ParentArgs } from '@/lib/decorators/parent-args.decorator'
import { UploadsService } from '@/uploads/uploads.service'
import {
  FindManyUserArgs,
  FindManyUserObject
} from '@/users/dto/users-queries.dto'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'

@Resolver(() => User)
export class UsersFieldsResolver {
  constructor(private upload: UploadsService) {}

  @ResolveField(() => String, { nullable: true })
  avatarUrl(@Parent() user: User) {
    return user.avatarKey
      ? this.upload.fileUrl('avatars', user.avatarKey)
      : null
  }

  @ResolveField(() => [Channel], { nullable: true })
  channels(
    @Parent() user: User,
    @Args() args: FindManyChannelsArgs,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.users.channelsLoader.load({
      userId: user.id,
      currentUserId: user.id,
      args
    })
  }

  @ResolveField(() => [Channel], { nullable: true })
  ownerChannels(
    @Parent() user: User,
    @Args() args: FindManyChannelsArgs,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.users.ownerChannelsLoader.load({
      userId: user.id,
      currentUserId: user.id,
      args
    })
  }
}

@Resolver(() => FindManyUserObject)
export class FindUsersFieldsResolver {
  constructor(private usersService: UsersService) {}

  @ResolveField(() => Int)
  count(@ParentArgs() parentArgs: FindManyUserArgs) {
    return this.usersService.countUsers(parentArgs.where)
  }
}
