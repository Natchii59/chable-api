import { Args, Query, Resolver } from '@nestjs/graphql'

import {
  FindManyUserArgs,
  FindManyUserObject,
  FindUniqueUserArgs
} from '@/users/dto/users-queries.dto'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'

@Resolver()
export class UsersQueriesResolver {
  constructor(private userService: UsersService) {}

  @Query(() => User, { nullable: true })
  getUser(@Args() args: FindUniqueUserArgs) {
    return this.userService.getUser(args.where)
  }

  @Query(() => FindManyUserObject, { nullable: true })
  async getUsers(@Args() args: FindManyUserArgs) {
    const { withCount, ...rest } = args

    const nodes = await this.userService.getUsers(rest)

    if (withCount) {
      const count = await this.userService.countUsers({
        where: args.where
      })
      return { nodes, count }
    }

    return { nodes }
  }
}
