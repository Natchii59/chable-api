import { Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/models/user.model'
import type { UsersService } from '@/users/users.service'

import type { JwtPayload } from 'types/auth'

@Resolver()
export class AuthQueriesResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, { nullable: true })
  async profile(@CurrentUser() payload: JwtPayload) {
    return this.usersService.getUser({ id: payload.userId })
  }
}
