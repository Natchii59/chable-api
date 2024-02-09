import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { Public } from '@/auth/decorators/public.decorator'
import { CreateUserInput } from '@/users/dto/users-mutations.dto'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'

@Resolver()
export class UsersMutationsResolver {
  constructor(private userService: UsersService) {}

  @Mutation(() => User, { nullable: true })
  @Public()
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input)
  }
}
