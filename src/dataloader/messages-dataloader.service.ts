import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'
import { mapFromArray } from '@/lib/map-from-array'

@Injectable()
export class MessagesDataloaderService {
  constructor(private db: DatabaseService) {}

  async getAuthorByBatch(authorIds: readonly string[]) {
    const ids = [...new Set(authorIds)]
    const users = await this.db.user.findMany({
      where: { id: { in: ids } }
    })

    const usersMap = mapFromArray(users, user => user.id)

    return authorIds.map(authorId => usersMap.get(authorId))
  }

  async getChannelByBatch(channelIds: readonly string[]) {
    const ids = [...new Set(channelIds)]
    const channels = await this.db.channel.findMany({
      where: { id: { in: ids } }
    })

    const channelsMap = mapFromArray(channels, channel => channel.id)

    return channelIds.map(channelId => channelsMap.get(channelId))
  }

  async getReadByByBatch(messageIds: string[], args?: Prisma.UserFindManyArgs) {
    const ids = [...new Set(messageIds)]
    const readBys = await this.db.user.findMany({
      ...args,
      where: {
        AND: [
          { ...args.where },
          { readMessages: { some: { id: { in: ids } } } }
        ]
      },
      include: {
        readMessages: { select: { id: true } }
      }
    })

    return messageIds.map(messageId =>
      readBys.filter(user => user.readMessages.some(m => m.id === messageId))
    )
  }
}
