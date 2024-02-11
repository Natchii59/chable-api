import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { Public } from '@/auth/decorators/public.decorator'
import {
  CreateUserArgs,
  UpdateUserArgs,
  UpdateUserPasswordArgs
} from '@/users/dto/users-mutations.dto'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'

import { JwtPayload } from 'types/auth'

@Resolver()
export class UsersMutationsResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User, { nullable: true })
  @Public()
  createUser(@Args() args: CreateUserArgs) {
    return this.usersService.createUser(args.data)
  }

  @Mutation(() => User, { nullable: true })
  updateUser(@Args() args: UpdateUserArgs, @CurrentUser() payload: JwtPayload) {
    const { userId } = payload
    return this.usersService.updateUser(userId, args.data)
  }

  @Mutation(() => User, { nullable: true })
  deleteUser(@CurrentUser() payload: JwtPayload) {
    const { userId } = payload
    return this.usersService.deleteUser(userId)
  }

  @Mutation(() => Boolean, { nullable: true })
  async updateUserPassword(
    @Args() args: UpdateUserPasswordArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    const { userId, refreshTokenId } = payload
    await this.usersService.updateUserPassword(userId, {
      oldPassword: args.data.oldPassword,
      password: args.data.password,
      refreshTokenId
    })

    return true
  }
}
