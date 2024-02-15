import { Socket as BaseSocket } from 'socket.io'

interface SocketData {
  user: {
    id: string
  }
}

export type Socket = BaseSocket<
  ListenEvents,
  EmitEvents,
  ServerSideEvents,
  SocketData
>

export type SocketError = {
  type?: string
  message: string | object
}
