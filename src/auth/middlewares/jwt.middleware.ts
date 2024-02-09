import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

import { SessionsService } from '@/auth/sessions.service'

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private sessionsService: SessionsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['accessToken']
    const refreshToken = req.cookies['refreshToken']

    if (!accessToken && !refreshToken) {
      return next()
    }

    try {
      await this.sessionsService.verifyAccessToken(accessToken)
      return next()
    } catch (err) {
      if (err.status !== 401) {
        return next()
      }
    }

    try {
      const dataRefreshToken =
        await this.sessionsService.verifyRefreshToken(refreshToken)

      const tokens = await this.sessionsService.refreshTokens(
        dataRefreshToken.refreshTokenId
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

      req.cookies['accessToken'] = tokens.accessToken
      req.cookies['refreshToken'] = tokens.refreshToken
    } catch (e) {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')
    }

    next()
  }
}
