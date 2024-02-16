import { Injectable } from '@nestjs/common'
import { Request, SubjectBeforeFilterHook } from 'nest-casl'

import { Channel } from '@/channels/models/channel.model'
import { DatabaseService } from '@/database/database.service'

@Injectable()
export class MessageChannelHook
  implements SubjectBeforeFilterHook<Channel, Request>
{
  constructor(readonly db: DatabaseService) {}

  run({ params }: Request) {
    const id = params.data.channelId

    return this.db.channel.findUnique({
      where: { id },
      include: { users: { select: { id: true } } }
    })
  }
}
