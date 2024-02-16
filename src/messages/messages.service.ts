import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from '@/database/database.service'

@Injectable()
export class MessagesService {
  constructor(private db: DatabaseService) {}

  createMessage(data: Prisma.MessageUncheckedCreateInput) {
    return this.db.message.create({ data })
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

  updateMessage(id: string, data: Prisma.MessageUpdateInput) {
    return this.db.message.update({
      where: { id },
      data
    })
  }

  deleteMessage(id: string) {
    return this.db.message.delete({ where: { id } })
  }
}
