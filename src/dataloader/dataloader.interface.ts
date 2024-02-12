import { Prisma } from '@prisma/client'
import * as DataLoader from 'dataloader'

import { Channel } from '@/channels/models/channel.model'
import { User } from '@/users/models/user.model'

export interface Dataloaders {
  channelsUsersLoader: DataLoader<ChannelsUsersLoaderArgs, Array<User>>
  usersChannelsLoader: DataLoader<UsersChannelsLoaderArgs, Array<Channel>>
  usersOwnerChannelsLoader: DataLoader<UsersChannelsLoaderArgs, Array<Channel>>
}

export interface ChannelsUsersLoaderArgs {
  args: Prisma.UserFindManyArgs
  channelId: string
}

export interface UsersChannelsLoaderArgs {
  args: Prisma.ChannelFindManyArgs
  userId: string
  currentUserId: string
}
