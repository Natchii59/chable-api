import {
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
  Resolver
} from '@nestjs/graphql'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { Channel } from '@/channels/models/channel.model'
import { Dataloaders } from '@/dataloader/dataloader.interface'
import { ParentArgs } from '@/lib/decorators/parent-args.decorator'
import {
  FindManyMessageArgs,
  FindManyMessagesObject
} from '@/messages/dto/messages-queries.dto'
import { MessagesService } from '@/messages/messages.service'
import { Message } from '@/messages/models/message.model'
import { FindManyUserArgs } from '@/users/dto/users-queries.dto'
import { User } from '@/users/models/user.model'

import { JwtPayload } from 'types/auth'

@Resolver(() => Message)
export class MessagesFieldsResolver {
  constructor() {}

  @ResolveField(() => User)
  author(@Parent() message: Message, @Context('loaders') loaders: Dataloaders) {
    return loaders.messages.authorLoader.load(message.authorId)
  }

  @ResolveField(() => Channel)
  channel(
    @Parent() message: Message,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.messages.channelLoader.load(message.channelId)
  }

  @ResolveField(() => [User])
  readBy(
    @Parent() message: Message,
    @Args() args: FindManyUserArgs,
    @Context('loaders') loaders: Dataloaders
  ) {
    return loaders.messages.readByLoader.load({
      messageId: message.id,
      args
    })
  }
}

@Resolver(() => FindManyMessagesObject)
export class FindMessagesFieldsResolver {
  constructor(private messagesService: MessagesService) {}

  @ResolveField(() => Int)
  count(
    @ParentArgs() parentArgs: FindManyMessageArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    return this.messagesService.countMessages(parentArgs.where, payload.userId)
  }
}
