import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'
import { SocketEvents } from '@/lib/socket-events'
import { SocketGateway } from '@/socket/socket.gateway'

@Injectable()
export class MessagesService {
  constructor(
    private db: DatabaseService,
    private io: SocketGateway
  ) {}

  async createMessage(data: Prisma.MessageUncheckedCreateInput) {
    const message = await this.db.message.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarKey: true
          }
        }
      }
    })

    this.io.server
      .to(`users-on-channel:${message.channelId}`)
      .emit(SocketEvents.CREATE_MESSAGE_CLIENT, { message })

    return message
  }

  getMessage(id: string) {
    return this.db.message.findUnique({ where: { id } })
  }

  getMessages(args: Prisma.MessageFindManyArgs, userId: string) {
    return this.db.message.findMany({
      ...args,
      where: {
        AND: [
          { ...args.where },
          {
            channel: {
              users: { some: { id: userId } }
            }
          }
        ]
      }
    })
  }

  countMessages(where: Prisma.MessageWhereInput, userId: string) {
    return this.db.message.count({
      where: {
        AND: [
          { ...where },
          {
            channel: {
              users: { some: { id: userId } }
            }
          }
        ]
      }
    })
  }

  async updateMessage(id: string, data: Prisma.MessageUpdateInput) {
    const message = await this.db.message.update({
      where: { id },
      data
    })

    this.io.server
      .to(`channel:${message.channelId}`)
      .emit(SocketEvents.UPDATE_MESSAGE_CLIENT, { message })

    return message
  }

  async deleteMessage(id: string) {
    const message = await this.db.message.delete({ where: { id } })

    this.io.server
      .to(`channel:${message.channelId}`)
      .emit(SocketEvents.DELETE_MESSAGE_CLIENT, { message })

    return message
  }
}
