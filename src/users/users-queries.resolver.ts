import { Args, Query, Resolver } from '@nestjs/graphql'

import {
  FindManyUserObject,
  type FindManyUserArgs,
  type FindUniqueUserArgs
} from '@/users/dto/users-queries.dto'
import { User } from '@/users/models/user.model'
import type { UsersService } from '@/users/users.service'

@Resolver()
export class UsersQueriesResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  getUser(@Args() args: FindUniqueUserArgs) {
    return this.usersService.getUser(args.where)
  }

  @Query(() => FindManyUserObject, { nullable: true })
  async getUsers(@Args() args: FindManyUserArgs) {
    const users = await this.usersService.getUsers(args)

    return { users }
  }
}
