import { ArgumentsHost, Catch } from '@nestjs/common'
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets'

import { SocketEvents } from '@/lib/socket-events'

import { Socket, SocketError } from 'types/socket'

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs()
    const socket = ctx.getClient<Socket>()

    const event = ctx.getPattern()
    const error = exception.getError() as SocketError

    socket.emit(SocketEvents.ERROR, {
      event,
      type: error.type ?? 'error',
      message: error.message
    })
  }
}
