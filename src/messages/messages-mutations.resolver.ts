import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AccessGuard, Actions, UseAbility } from 'nest-casl'

import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { Channel } from '@/channels/models/channel.model'
import {
  CreateMessageArgs,
  DeleteMessageArgs,
  UpdateMessageArgs
} from '@/messages/dto/messages-mutations.dto'
import { MessagesService } from '@/messages/messages.service'
import { Message } from '@/messages/models/message.model'
import { MessageChannelHook } from '@/messages/permissions/message-channel.hooks'
import { MessageHook } from '@/messages/permissions/message.hooks'

import { JwtPayload } from 'types/auth'

@Resolver()
export class MessagesMutationsResolver {
  constructor(private messagesService: MessagesService) {}

  @Mutation(() => Message, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.create, Channel, MessageChannelHook)
  createMessage(
    @Args() args: CreateMessageArgs,
    @CurrentUser() payload: JwtPayload
  ) {
    return this.messagesService.createMessage({
      ...args.data,
      authorId: payload.userId
    })
  }

  @Mutation(() => Message, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, Message, MessageHook)
  updateMessage(@Args() args: UpdateMessageArgs) {
    return this.messagesService.updateMessage(args.id, args.data)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, Message, MessageHook)
  async deleteMessage(@Args() args: DeleteMessageArgs) {
    await this.messagesService.deleteMessage(args.id)
    return true
  }
}
