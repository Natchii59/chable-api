import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'

@Injectable()
export class UsersDataloaderService {
  constructor(private db: DatabaseService) {}

  async getChannelsUsersByBatch(
    channelIds: string[],
    args?: Prisma.UserFindManyArgs
  ) {
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
}
