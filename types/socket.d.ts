import { Socket as BaseSocket } from 'socket.io'

interface SocketData {
  user: {
    id: string
  }
}

export type Socket = BaseSocket<undefined, undefined, undefined, SocketData>
