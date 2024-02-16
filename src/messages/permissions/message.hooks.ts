import { Injectable } from '@nestjs/common'
import { Request, SubjectBeforeFilterHook } from 'nest-casl'

import { DatabaseService } from '@/database/database.service'
import { Message } from '@/messages/models/message.model'

@Injectable()
export class MessageHook implements SubjectBeforeFilterHook<Message, Request> {
  constructor(readonly db: DatabaseService) {}

  run({ params }: Request) {
    return this.db.message.findUnique({
      where: { id: params.id },
      include: {
        channel: {
          select: {
            type: true,
            ownerId: true,
            users: { select: { id: true } }
          }
        }
      }
    })
  }
}
