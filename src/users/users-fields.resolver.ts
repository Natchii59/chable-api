import { Int, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { ParentArgs } from '@/lib/parent-args.decorator'
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
}

@Resolver(() => FindManyUserObject)
export class FindUsersFieldsResolver {
  constructor(private usersService: UsersService) {}

  @ResolveField(() => Int)
  count(@ParentArgs() parentArgs: FindManyUserArgs) {
    return this.usersService.countUsers(parentArgs.where)
  }
}
