import { Injectable } from '@nestjs/common'
import { Request, SubjectBeforeFilterHook } from 'nest-casl'

import { ChannelsService } from '@/channels/channels.service'
import { Channel } from '@/channels/models/channel.model'
import { DatabaseService } from '@/database/database.service'

@Injectable()
export class ChannelHook implements SubjectBeforeFilterHook<Channel, Request> {
  constructor(readonly db: DatabaseService) {}

  run({ params }: Request) {
    return this.db.channel.findUnique({
      where: { id: params.id },
      include: { users: { select: { id: true } } }
    })
  }
}
