import { Int, ResolveField, Resolver } from '@nestjs/graphql'

import { ParentArgs } from '@/lib/parent-args.decorator'
import {
  FindManyUserObject,
  type FindManyUserArgs
} from '@/users/dto/users-queries.dto'
import type { UsersService } from '@/users/users.service'

@Resolver(() => FindManyUserObject)
export class UsersFieldsResolver {
  constructor(private usersService: UsersService) {}

  @ResolveField(() => Int)
  count(@ParentArgs() parentArgs: FindManyUserArgs) {
    return this.usersService.countUsers(parentArgs.where)
  }
}
