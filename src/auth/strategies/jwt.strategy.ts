import { Injectable } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { JwtPayload, JwtValidatePayload } from 'types/auth'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookies
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_ACCESS_TOKEN_SECRET')
    })
  }

  private static extractJwtFromCookies(req: Request): string | null {
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      req.cookies['accessToken'].length > 0
    ) {
      return req.cookies['accessToken']
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
