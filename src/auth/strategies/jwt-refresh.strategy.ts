import { Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { JwtPayload, JwtValidatePayload } from 'types/auth'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJwtFromCookies
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_REFRESH_TOKEN_SECRET')
    })
  }

  private static extractJwtFromCookies(req: Request): string | null {
    if (
      req.cookies &&
      'refreshToken' in req.cookies &&
      req.cookies['refreshToken'].length > 0
    ) {
      return req.cookies['refreshToken']
    }

    return null
  }

  validate(payload: JwtValidatePayload<JwtPayload>): JwtPayload {
    if (!payload) return null

    return {
      refreshTokenId: payload.refreshTokenId,
      userId: payload.userId
    }
  }
}
