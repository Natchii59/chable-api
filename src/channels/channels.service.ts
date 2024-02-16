import { ConflictException, Injectable } from '@nestjs/common'
import { ChannelType, Prisma } from '@prisma/client'

import { CreateChannelInput } from '@/channels/dto/channels-mutations.dto'
import { DatabaseService } from '@/database/database.service'
import { SocketEvents } from '@/lib/socket-events'
import { SocketGateway } from '@/socket/socket.gateway'

@Injectable()
export class ChannelsService {
  constructor(
    private db: DatabaseService,
    private io: SocketGateway
  ) {}

  async createChannel(input: CreateChannelInput, userId: string) {
    const userIds = input.userIds || []
    userIds.push(userId)

    if (input.type === ChannelType.PRIVATE) {
      const existingChannel = await this.db.channel.findFirst({
        where: {
          type: ChannelType.PRIVATE,
          users: {
            every: {
              id: {
                in: userIds
              }
            }
          }
        }
      })

      if (existingChannel) {
        throw new ConflictException('Private channel already exists')
      }
    }

    const channel = await this.db.channel.create({
      data: {
        type: input.type,
        name: input.type === ChannelType.PUBLIC ? input.name : undefined,
        ownerId: input.type !== ChannelType.PRIVATE ? userId : undefined,
        users: {
          connect: userIds.map(id => ({ id }))
        }
      },
      include: {
        users: input.type !== ChannelType.PUBLIC && {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
        // TODO: Add unread messages count
      }
    })

    this.io.server
      .to(userIds.map(id => `user:${id}`))
      .socketsJoin(`users-on-channel:${channel.id}`)

    this.io.server
      .to(`users-on-channel:${channel.id}`)
      .emit(SocketEvents.CREATE_CHANNEL_CLIENT, { channel })

    return channel
  }

  getChannel(id: string) {
    return this.db.channel.findUnique({
      where: { id }
    })
  }

  getChannels(args: Prisma.ChannelFindManyArgs, userId: string) {
    return this.db.channel.findMany({
      ...args,
      where: {
        AND: [
          { ...args.where },
          {
            OR: [
              { users: { some: { id: userId } } },
              { type: ChannelType.PUBLIC }
            ]
          }
        ]
      }
    })
  }

  countChannels(where: Prisma.ChannelWhereInput, userId: string) {
    return this.db.channel.count({
      where: {
        AND: [
          { ...where },
          {
            OR: [
              { users: { some: { id: userId } } },
              { type: ChannelType.PUBLIC }
            ]
          }
        ]
      }
    })
  }

  async updateChannel(id: string, data: Prisma.ChannelUpdateInput) {
    const channel = await this.db.channel.update({
      where: { id },
      data
    })

    this.io.server
      .to(`users-on-channel:${channel.id}`)
      .emit(SocketEvents.UPDATE_CHANNEL_CLIENT, { channel })

    return channel
  }

  async deleteChannel(id: string) {
    const channel = await this.db.channel.delete({
      where: { id }
    })

    this.io.server
      .to(`users-on-channel:${channel.id}`)
      .emit(SocketEvents.DELETE_CHANNEL_CLIENT, { id: channel.id })

    this.io.server
      .in(`users-on-channel:${channel.id}`)
      .socketsLeave(`users-on-channel:${channel.id}`)

    return channel
  }

  async joinChannel(id: string, userIds: string[]) {
    const channel = await this.db.channel.update({
      where: { id },
      data: {
        users: {
          connect: userIds.map(id => ({ id }))
        }
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            name: true
          },
          where: {
            id: {
              in: userIds
            }
          }
        }
      }
    })

    const users = channel.users.filter(u => userIds.includes(u.id))

    this.io.server
      .to(userIds.map(id => `user:${id}`))
      .socketsJoin(`users-on-channel:${id}`)

    this.io.server
      .to(`users-on-channel:${id}`)
      .emit(SocketEvents.JOIN_CHANNEL_CLIENT, {
        channel,
        users
      })
  }

  async leaveChannel(id: string, userIds: string[]) {
    await this.db.channel.update({
      where: { id },
      data: {
        users: {
          disconnect: userIds.map(id => ({ id }))
        }
      }
    })

    this.io.server
      .to(userIds.map(id => `user:${id}`))
      .socketsLeave(`users-on-channel:${id}`)

    this.io.server
      .to(`users-on-channel:${id}`)
      .emit(SocketEvents.LEAVE_CHANNEL_CLIENT, {
        channelId: id,
        userIds
      })
  }

  async readChannel(id: string, userId: string) {
    const messages = await this.db.message.findMany({
      where: {
        channelId: id,
        readBy: { none: { id: userId } }
      },
      select: { id: true }
    })

    await this.db.user.update({
      where: { id: userId },
      data: {
        readMessages: {
          connect: messages
        }
      }
    })

    this.io.server.to(`channel:${id}`).emit(SocketEvents.READ_CHANNEL_CLIENT, {
      channelId: id,
      userId
    })
  }
}
