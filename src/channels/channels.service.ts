import { ConflictException, Injectable } from '@nestjs/common'
import { ChannelType, Prisma } from '@prisma/client'

import { CreateChannelInput } from '@/channels/dto/channels-mutations.dto'
import { DatabaseService } from '@/database/database.service'

@Injectable()
export class ChannelsService {
  constructor(private db: DatabaseService) {}

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

    return this.db.channel.create({
      data: {
        type: input.type,
        name: input.type === ChannelType.PUBLIC ? input.name : undefined,
        ownerId: input.type !== ChannelType.PRIVATE ? userId : undefined,
        users: {
          connect: userIds.map(id => ({ id }))
        }
      }
    })
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

  updateChannel(id: string, data: Prisma.ChannelUpdateInput) {
    return this.db.channel.update({
      where: { id },
      data
    })
  }

  deleteChannel(id: string) {
    return this.db.channel.delete({
      where: { id }
    })
  }
}
