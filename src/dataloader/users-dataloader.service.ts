import { Injectable } from '@nestjs/common'
import { ChannelType, Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'

@Injectable()
export class UsersDataloaderService {
  constructor(private db: DatabaseService) {}

  async getChannelsByBatch(
    userIds: string[],
    currentUserId: string,
    args?: Prisma.ChannelFindManyArgs
  ) {
    const channels = await this.db.channel.findMany({
      ...args,
      where: {
        AND: [
          {
            AND: [
              { ...args.where },
              { users: { some: { id: { in: userIds } } } }
            ]
          },
          {
            OR: [
              { users: { some: { id: currentUserId } } },
              { type: ChannelType.PUBLIC }
            ]
          }
        ]
      },
      include: {
        users: { select: { id: true } }
      }
    })

    return userIds.map(userId =>
      channels.filter(channel => channel.users.some(u => u.id === userId))
    )
  }

  async getOwnerChannelsByBatch(
    userIds: string[],
    currentUserId: string,
    args?: Prisma.ChannelFindManyArgs
  ) {
    const channels = await this.db.channel.findMany({
      ...args,
      where: {
        AND: [
          {
            AND: [{ ...args.where }, { ownerId: { in: userIds } }]
          },
          {
            OR: [
              { users: { some: { id: currentUserId } } },
              { type: ChannelType.PUBLIC }
            ]
          }
        ]
      }
    })

    return userIds.map(userId =>
      channels.filter(channel => channel.ownerId === userId)
    )
  }
}
