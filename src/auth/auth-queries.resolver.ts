import { Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'

import { JwtPayload } from 'types/auth'

@Resolver()
export class AuthQueriesResolver {
  constructor(private userService: UsersService) {}

  @Query(() => User, { nullable: true })
  async profile(@CurrentUser() payload: JwtPayload) {
    return this.userService.getUser({ id: payload.userId })
  }
}
