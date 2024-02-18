import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { createId } from '@paralleldrive/cuid2'
import { Response } from 'express'
import { UAParser } from 'ua-parser-js'

import { DatabaseService } from '@/database/database.service'

import { JwtPayload } from 'types/auth'

@Injectable()
export class SessionsService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async generateNewTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: '60s'
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

  async createAndSaveTokens(userId: string, userAgent: string) {
    const refreshTokenId = createId()

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser()
    const os = parser.getOS()

    const tokens = await this.generateNewTokens({
      refreshTokenId,
      userId
    })

    await this.db.session.create({
      data: {
        id: refreshTokenId,
        userId,
        browser: browser.name,
        os: os.name
      }
    })

    return tokens
  }

  async updateRefreshToken(id: string) {
    await this.db.session.update({
      where: { id },
      data: {
        updatedAt: new Date()
      }
    })
  }

  async deleteRefreshToken(id: string) {
    await this.db.session.delete({ where: { id } })
  }

  async refreshTokens(refreshTokenId: string) {
    const session = await this.db.session.findUnique({
      where: { id: refreshTokenId }
    })

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const tokens = await this.generateNewTokens({
      refreshTokenId: session.id,
      userId: session.userId
    })

    await this.updateRefreshToken(session.id)

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

  async verifyAccessToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        ignoreExpiration: false
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid access token')
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        ignoreExpiration: false
      })
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.')
    }
  }

  async getSession(id: string) {
    return this.db.session.findUnique({ where: { id } })
  }

  async getUserSessions(userId: string) {
    return this.db.session.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })
  }
}
