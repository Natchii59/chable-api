import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'
import { mapFromArray } from '@/lib/map-from-array'

@Injectable()
export class ChannelsDataloaderService {
  constructor(private db: DatabaseService) {}

  async getUsersByBatch(channelIds: string[], args?: Prisma.UserFindManyArgs) {
    const users = await this.db.user.findMany({
      ...args,
      where: {
        AND: [
          { ...args.where },
          { channels: { some: { id: { in: channelIds } } } }
        ]
      },
      include: {
        channels: { select: { id: true } }
      }
    })

    return channelIds.map(channelId =>
      users.filter(user => user.channels.some(ch => ch.id === channelId))
    )
  }

  async getOwnerByBatch(ownerIds: readonly string[]) {
    const ids = [...new Set(ownerIds)]
    const owners = await this.db.user.findMany({
      where: { id: { in: ids } }
    })

    const ownersMap = mapFromArray(owners, owner => owner.id)

    return ownerIds.map(ownerId => ownersMap.get(ownerId))
  }

  async getMessagesByBatch(
    channelIds: string[],
    args?: Prisma.MessageFindManyArgs
  ) {
    const messages = await this.db.message.findMany({
      ...args,
      where: {
        AND: [{ ...args.where }, { channelId: { in: channelIds } }]
      }
    })

    return channelIds.map(channelId =>
      messages.filter(message => message.channelId === channelId)
    )
  }

  async getLastMessageByBatch(channelIds: readonly string[]) {
    const ids = [...new Set(channelIds)]
    const channels = await this.db.channel.findMany({
      where: { id: { in: ids } },
      include: {
        messages: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    })

    const channelsMap = mapFromArray(channels, channel => channel.id)

    return channelIds.map(channelId => channelsMap.get(channelId).messages[0])
  }

  async getUnreadMessagesByBatch(channelIds: string[], currentUserId: string) {
    const ids = [...new Set(channelIds)]
    const channels = await this.db.channel.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        _count: {
          select: {
            messages: {
              where: {
                readBy: { none: { id: currentUserId } }
              }
            }
          }
        }
      }
    })

    const channelsMap = mapFromArray(channels, channel => channel.id)

    return channelIds.map(
      channelId => channelsMap.get(channelId)._count.messages
    )
  }
}
