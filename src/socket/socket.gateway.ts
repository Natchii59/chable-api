import { UseFilters, UsePipes } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException
} from '@nestjs/websockets'
import { parse as parseCookie } from 'cookie'
import { Server } from 'socket.io'

import { SessionsService } from '@/auth/sessions.service'
import { SocketEvents } from '@/lib/socket-events'
import { SocketChannelInput } from '@/socket/dto/socket-channel.dto'
import { WsExceptionFilter } from '@/socket/utils/ws-exception.filter'
import { WsValidationPipe } from '@/socket/utils/ws-validation.pipe'

import { Socket } from 'types/socket'

@WebSocketGateway({
  cors: {
    credentials: true
  }
})
@UseFilters(new WsExceptionFilter())
@UsePipes(new WsValidationPipe({ transform: true }))
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

  @SubscribeMessage(SocketEvents.JOIN_CHANNEL_ROOM_SERVER)
  async handleJoinChannelRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketChannelInput
  ) {
    const userId = socket.data.user.id

    if (!socket.rooms.has(`users-on-channel:${input.id}`)) {
      throw new WsException({
        message: 'You are not allowed to join this channel'
      })
    }

    socket.join(`channel:${input.id}`)

    socket.emit(SocketEvents.JOIN_CHANNEL_ROOM_CLIENT, {
      channelId: input.id,
      userId
    })
  }

  @SubscribeMessage(SocketEvents.LEAVE_CHANNEL_ROOM_SERVER)
  async handleLeaveChannelRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketChannelInput
  ) {
    const userId = socket.data.user.id

    if (!socket.rooms.has(`channel:${input.id}`)) {
      throw new WsException({
        message: 'You are not allowed to leave this channel'
      })
    }

    socket.leave(`channel:${input.id}`)

    socket.emit(SocketEvents.LEAVE_CHANNEL_ROOM_CLIENT, {
      channelId: input.id,
      userId
    })
  }

  @SubscribeMessage(SocketEvents.TYPING_START_SERVER)
  async handleTypingStart(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketChannelInput
  ) {
    const userId = socket.data.user.id

    if (!socket.rooms.has(`channel:${input.id}`)) {
      throw new WsException({
        message: 'You are not allowed to send typing events to this channel'
      })
    }

    socket.to(`channel:${input.id}`).emit(SocketEvents.TYPING_START_CLIENT, {
      channelId: input.id,
      userId
    })
  }

  @SubscribeMessage(SocketEvents.TYPING_STOP_SERVER)
  async handleTypingStop(
    @ConnectedSocket() socket: Socket,
    @MessageBody() input: SocketChannelInput
  ) {
    const userId = socket.data.user.id

    if (!socket.rooms.has(`channel:${input.id}`)) {
      throw new WsException({
        message: 'You are not allowed to send typing events to this channel'
      })
    }

    socket.to(`channel:${input.id}`).emit(SocketEvents.TYPING_STOP_CLIENT, {
      channelId: input.id,
      userId
    })
  }
}
