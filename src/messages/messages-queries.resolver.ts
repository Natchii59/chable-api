import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccessGuard, Actions, UseAbility } from 'nest-casl'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import {
  FindManyMessageArgs,
  FindManyMessagesObject,
  FindUniqueMessageArgs
} from '@/messages/dto/messages-queries.dto'
import { MessagesService } from '@/messages/messages.service'
import { Message } from '@/messages/models/message.model'
import { MessageHook } from '@/messages/permissions/message.hooks'

import { JwtPayload } from 'types/auth'

@Resolver()
export class MessagesQueriesResolver {
  constructor(private messagesService: MessagesService) {}

  @Query(() => Message, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, Message, MessageHook)
  getMessage(@Args() args: FindUniqueMessageArgs) {
    return this.messagesService.getMessage(args.id)
  }

  @Query(() => FindManyMessagesObject, { nullable: true })
  async getMessages(
    @Args() args: FindManyMessageArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    const messages = await this.messagesService.getMessages(
      args,
      payload.userId
    )

    return { messages }
  }
}
