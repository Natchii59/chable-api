import {
  Injectable,
  UnauthorizedException,
  type ExecutionContext
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

import type { JwtPayload } from 'types/auth'

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super()
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }

  handleRequest<TUser = JwtPayload>(err: Error, user: TUser): TUser {
    if (err || !user) {
      throw new UnauthorizedException('The refresh token is invalid')
    }

    return user
  }
}
