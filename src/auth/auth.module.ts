import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { AuthQueriesResolver } from '@/auth/auth-queries.resolver'
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy'
import { JwtStrategy } from '@/auth/strategies/jwt.strategy'
import { UsersModule } from '@/users/users.module'
import { AuthMutationsResolver } from './auth-mutations.resolver'
import { AuthService } from './auth.service'

@Module({
  imports: [UsersModule, PassportModule, JwtModule],
  providers: [
    AuthService,
    AuthQueriesResolver,
    AuthMutationsResolver,
    JwtStrategy,
    JwtRefreshStrategy
  ]
})
export class AuthModule {}
