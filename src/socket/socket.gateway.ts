import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { parse as parseCookie } from 'cookie'
import { Server } from 'socket.io'

import { SessionsService } from '@/auth/sessions.service'
import { Events } from '@/lib/events'

import { Socket } from 'types/socket'

@WebSocketGateway({
  cors: {
    credentials: true
  }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private sessionsService: SessionsService) {}

  @WebSocketServer()
  server: Server

  async handleConnection(socket: Socket) {
    try {
      const { cookie: rawCookie, authorization } = socket.handshake.headers

      let token: string | null = null

      if (authorization) {
        token = authorization
      } else if (rawCookie) {
        const cookie = parseCookie(rawCookie)
        token = cookie['accessToken']
      }

      const payload = await this.sessionsService.verifyAccessToken(token)

      socket.data.user = { id: payload.userId }
      socket.join(`user:${payload.userId}`)

      console.log('Socket connected:', socket.id)
    } catch (err) {
      console.log('Socket unauthorized:', socket.id)
      socket.disconnect()
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('Socket disconnected:', socket.id)
  }

  @SubscribeMessage(Events.MESSAGE)
  handleMessage(@MessageBody() payload: string) {
    this.server.emit(Events.MESSAGE, payload)
  }
}
