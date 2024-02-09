import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthQueriesResolver } from '@/auth/auth-queries.resolver'
import { SessionsService } from '@/auth/sessions.service'
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy'
import { JwtStrategy } from '@/auth/strategies/jwt.strategy'
import { UsersModule } from '@/users/users.module'
import { AuthMutationsResolver } from './auth-mutations.resolver'
import { AuthService } from './auth.service'

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [
    AuthService,
    SessionsService,
    AuthQueriesResolver,
    AuthMutationsResolver,
    JwtStrategy,
    JwtRefreshStrategy
  ],
  exports: [SessionsService]
})
export class AuthModule {}
