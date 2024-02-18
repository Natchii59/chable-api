import { Query, Resolver } from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'
import { Session } from './models/session.model'
import { SessionsService } from './sessions.service'

import { JwtPayload } from 'types/auth'

@Resolver()
export class AuthQueriesResolver {
  constructor(
    private usersService: UsersService,
    private sessionsService: SessionsService
  ) {}

  @Query(() => User, { nullable: true })
  profile(@CurrentUser() payload: JwtPayload) {
    return this.usersService.getUser({ id: payload.userId })
  }

  @Query(() => [Session], { nullable: true })
  getUserSessions(@CurrentUser() payload: JwtPayload) {
    return this.sessionsService.getUserSessions(payload.userId)
  }

  @Query(() => Session, { nullable: true })
  getCurrentSession(@CurrentUser() payload: JwtPayload) {
    return this.sessionsService.getSession(payload.refreshTokenId)
  }
}
