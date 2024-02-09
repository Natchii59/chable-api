import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { Request, Response } from 'express'

import { AuthService } from '@/auth/auth.service'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { LoginArgs } from '@/auth/dto/auth-mutations.dto'
import { JwtRefreshAuthGuard } from '@/auth/guards/jwt-refresh.guard'
import { User } from '@/users/models/user.model'
import { UsersService } from '@/users/users.service'
import { Public } from './decorators/public.decorator'

import { UserPayload } from 'types/auth'

@Resolver()
export class AuthMutationsResolver {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @Mutation(() => User, { nullable: true })
  @Public()
  async login(@Args() args: LoginArgs, @Context('res') res: Response) {
    const payload = await this.authService.validateUser(
      args.email,
      args.password
    )

    if (!payload) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const tokens = await this.authService.generateNewTokens(payload)
    await this.authService.updateRefreshToken(payload.id, tokens.refreshToken)

    this.authService.createTokenCookie(res, tokens.accessToken, 'accessToken')
    this.authService.createTokenCookie(res, tokens.refreshToken, 'refreshToken')

    return this.userService.getUser({ id: payload.id })
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(
    @Context('res') res: Response,
    @CurrentUser() user: UserPayload
  ) {
    await this.authService.updateRefreshToken(user.id, null)

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    return true
  }

  @Mutation(() => Boolean, { nullable: true })
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  async refreshTokens(
    @Context('req') req: Request,
    @Context('res') res: Response,
    @CurrentUser() user: UserPayload
  ) {
    const refreshToken = req.cookies['refreshToken']

    const tokens = await this.authService.refreshTokens(user.id, refreshToken)

    this.authService.createTokenCookie(res, tokens.accessToken, 'accessToken')
    this.authService.createTokenCookie(res, tokens.refreshToken, 'refreshToken')

    return true
  }
}
