import { Prisma } from '@prisma/client'
import * as DataLoader from 'dataloader'

import { Channel } from '@/channels/models/channel.model'
import { Message } from '@/messages/models/message.model'
import { User } from '@/users/models/user.model'

export interface Dataloaders {
  users: {
    channelsLoader: DataLoader<UsersChannelsLoaderArgs, Array<Channel>>
    ownerChannelsLoader: DataLoader<UsersChannelsLoaderArgs, Array<Channel>>
  }
  channels: {
    usersLoader: DataLoader<ChannelsUsersLoaderArgs, Array<User>>
    ownerLoader: DataLoader<string, User>
    messagesLoader: DataLoader<ChannelsMessagesLoaderArgs, Array<Message>>
    lastMessageLoader: DataLoader<string, Message>
    unreadMessagesLoader: DataLoader<ChannelsUnreadMessagesLoaderArgs, number>
  }
  messages: {
    authorLoader: DataLoader<string, User>
    channelLoader: DataLoader<string, Channel>
    readByLoader: DataLoader<MessagesReadByLoaderArgs, Array<User>>
  }
}

export interface UsersChannelsLoaderArgs {
  args: Prisma.ChannelFindManyArgs
  userId: string
  currentUserId: string
}

export interface ChannelsUsersLoaderArgs {
  args: Prisma.UserFindManyArgs
  channelId: string
}

export interface ChannelsMessagesLoaderArgs {
  args: Prisma.MessageFindManyArgs
  channelId: string
}

export interface ChannelsUnreadMessagesLoaderArgs {
  channelId: string
  currentUserId: string
}

export interface MessagesReadByLoaderArgs {
  args: Prisma.UserFindManyArgs
  messageId: string
}
