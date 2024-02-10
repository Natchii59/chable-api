import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import type { Request, Response } from 'express'

import type { AuthService } from '@/auth/auth.service'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import type { LoginArgs } from '@/auth/dto/auth-mutations.dto'
import { JwtRefreshAuthGuard } from '@/auth/guards/jwt-refresh.guard'
import type { SessionsService } from '@/auth/sessions.service'
import { User } from '@/users/models/user.model'
import type { UsersService } from '@/users/users.service'
import { Public } from './decorators/public.decorator'

import type { JwtPayload } from 'types/auth'

@Resolver()
export class AuthMutationsResolver {
  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
    private usersService: UsersService
  ) {}

  @Mutation(() => User, { nullable: true })
  @Public()
  async login(
    @Args() args: LoginArgs,
    @Context('res') res: Response,
    @Context('req') req: Request
  ) {
    const accessToken = req.cookies['accessToken']

    if (accessToken) {
      const logged = await this.sessionsService
        .verifyAccessToken(accessToken)
        .then(() => true)
        .catch(() => false)

      if (logged) {
        throw new UnauthorizedException('Already logged in')
      }
    }

    const payload = await this.authService.validateUser(
      args.email,
      args.password
    )

    if (!payload) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const tokens = await this.sessionsService.createAndSaveTokens(
      payload.userId,
      req.get('user-agent')
    )

    this.sessionsService.createTokenCookie(
      res,
      tokens.accessToken,
      'accessToken'
    )
    this.sessionsService.createTokenCookie(
      res,
      tokens.refreshToken,
      'refreshToken'
    )

    return this.usersService.getUser({ id: payload.userId })
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(
    @Context('res') res: Response,
    @CurrentUser() payload: JwtPayload
  ) {
    await this.sessionsService.deleteRefreshToken(payload.refreshTokenId)

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(
    @Context('res') res: Response,
    @CurrentUser() payload: JwtPayload
  ) {
    const tokens = await this.sessionsService.refreshTokens(
      payload.refreshTokenId
    )

    this.sessionsService.createTokenCookie(
      res,
      tokens.accessToken,
      'accessToken'
    )
    this.sessionsService.createTokenCookie(
      res,
      tokens.refreshToken,
      'refreshToken'
    )

    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  async revokeRefreshToken(@Args('refreshTokenId') refreshTokenId: string) {
    await this.sessionsService.deleteRefreshToken(refreshTokenId)

    return true
  }
}
