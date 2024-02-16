import { Injectable } from '@nestjs/common'
import * as DataLoader from 'dataloader'

import { Channel } from '@/channels/models/channel.model'
import { ChannelsDataloaderService } from '@/dataloader/channels-dataloader.service'
import {
  ChannelsMessagesLoaderArgs,
  ChannelsUnreadMessagesLoaderArgs,
  ChannelsUsersLoaderArgs,
  Dataloaders,
  MessagesReadByLoaderArgs,
  UsersChannelsLoaderArgs
} from '@/dataloader/dataloader.interface'
import { MessagesDataloaderService } from '@/dataloader/messages-dataloader.service'
import { UsersDataloaderService } from '@/dataloader/users-dataloader.service'
import { Message } from '@/messages/models/message.model'
import { User } from '@/users/models/user.model'

@Injectable()
export class DataloaderService {
  constructor(
    private usersDataloder: UsersDataloaderService,
    private channelsDataloader: ChannelsDataloaderService,
    private messagesDataloader: MessagesDataloaderService
  ) {}

  getLoaders(): Dataloaders {
    return {
      users: {
        channelsLoader: this.createUsersChannelsLoader(),
        ownerChannelsLoader: this.createUsersOwnerChannelsLoader()
      },
      channels: {
        usersLoader: this.createChannelsUsersLoader(),
        ownerLoader: this.createChannelsOwnerLoader(),
        messagesLoader: this.createChannelsMessagesLoader(),
        lastMessageLoader: this.createChannelsLastMessageLoader(),
        unreadMessagesLoader: this.createChannelsUnreadMessagesLoader()
      },
      messages: {
        authorLoader: this.createMessagesAuthorLoader(),
        channelLoader: this.createMessagesChannelLoader(),
        readByLoader: this.createMessagesReadByLoader()
      }
    }
  }

  private createUsersChannelsLoader() {
    return new DataLoader<UsersChannelsLoaderArgs, Array<Channel>>(
      async (props: UsersChannelsLoaderArgs[]) => {
        const ids = props.map(arg => arg.userId)
        const { currentUserId, args } = props[0]

        return this.usersDataloder.getChannelsByBatch(ids, currentUserId, args)
      },
      { cache: false }
    )
  }

  private createUsersOwnerChannelsLoader() {
    return new DataLoader<UsersChannelsLoaderArgs, Array<Channel>>(
      async (props: UsersChannelsLoaderArgs[]) => {
        const ids = props.map(arg => arg.userId)
        const { currentUserId, args } = props[0]

        return this.usersDataloder.getOwnerChannelsByBatch(
          ids,
          currentUserId,
          args
        )
      },
      { cache: false }
    )
  }

  private createChannelsUsersLoader() {
    return new DataLoader<ChannelsUsersLoaderArgs, Array<User>>(
      async (props: ChannelsUsersLoaderArgs[]) => {
        const ids = props.map(arg => arg.channelId)
        const { args } = props[0]

        return this.channelsDataloader.getUsersByBatch(ids, args)
      },
      { cache: false }
    )
  }

  private createChannelsOwnerLoader() {
    return new DataLoader<string, User>(
      async ids => {
        return this.channelsDataloader.getOwnerByBatch(ids)
      },
      { cache: false }
    )
  }

  private createChannelsMessagesLoader() {
    return new DataLoader<ChannelsMessagesLoaderArgs, Array<Message>>(
      async props => {
        const ids = props.map(arg => arg.channelId)
        const { args } = props[0]

        return this.channelsDataloader.getMessagesByBatch(ids, args)
      },
      { cache: false }
    )
  }

  private createChannelsLastMessageLoader() {
    return new DataLoader<string, Message>(
      async ids => {
        return this.channelsDataloader.getLastMessageByBatch(ids)
      },
      { cache: false }
    )
  }

  private createChannelsUnreadMessagesLoader() {
    return new DataLoader<ChannelsUnreadMessagesLoaderArgs, number>(
      async props => {
        const ids = props.map(arg => arg.channelId)
        const { currentUserId } = props[0]

        return this.channelsDataloader.getUnreadMessagesByBatch(
          ids,
          currentUserId
        )
      },
      { cache: false }
    )
  }

  private createMessagesAuthorLoader() {
    return new DataLoader<string, User>(
      async ids => {
        return this.messagesDataloader.getAuthorByBatch(ids)
      },
      { cache: false }
    )
  }

  private createMessagesChannelLoader() {
    return new DataLoader<string, Channel>(
      async ids => {
        return this.messagesDataloader.getChannelByBatch(ids)
      },
      { cache: false }
    )
  }

  private createMessagesReadByLoader() {
    return new DataLoader<MessagesReadByLoaderArgs, Array<User>>(
      async props => {
        const ids = props.map(arg => arg.messageId)
        const { args } = props[0]

        return this.messagesDataloader.getReadByByBatch(ids, args)
      },
      { cache: false }
    )
  }
}
