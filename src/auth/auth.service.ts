import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'

import { compareHash, hashString } from '@/lib/hash'
import { UsersService } from '@/users/users.service'

import { UserPayload } from 'types/auth'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUser({ email })

    if (!user) {
      return null
    }

    const isPasswordValid = await compareHash(password, user.password)

    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id
    }
  }

  async generateNewTokens(payload: UserPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '10s'
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: '7d'
      })
    ])

    return {
      accessToken,
      refreshToken
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    if (refreshToken) refreshToken = await hashString(refreshToken)
    await this.userService.updateUser(userId, { refreshToken })
  }

  async refreshTokens(userId: string, refreshToken: string | null) {
    const user = await this.userService.getUser({ id: userId })

    if (!user) {
      throw new UnauthorizedException('Invalid user')
    }

    const isRefreshTokenValid = await compareHash(
      refreshToken,
      user.refreshToken
    )

    if (!refreshToken || !isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const tokens = await this.generateNewTokens({ id: user.id })
    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  createTokenCookie(
    res: Response,
    token: string,
    tokenType: 'accessToken' | 'refreshToken'
  ) {
    const accessTokenMaxAge = 1000 * 60 * 60
    const refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 7

    res.cookie(tokenType, token, {
      httpOnly: true,
      maxAge:
        tokenType === 'accessToken' ? accessTokenMaxAge : refreshTokenMaxAge,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    })
  }
}
