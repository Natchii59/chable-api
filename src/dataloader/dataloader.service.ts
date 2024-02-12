import { Injectable } from '@nestjs/common'
import * as DataLoader from 'dataloader'

import { Channel } from '@/channels/models/channel.model'
import { ChannelsDataloaderService } from '@/dataloader/channels-dataloader.service'
import {
  ChannelsUsersLoaderArgs,
  Dataloaders,
  UsersChannelsLoaderArgs
} from '@/dataloader/dataloader.interface'
import { UsersDataloaderService } from '@/dataloader/users-dataloader.service'
import { User } from '@/users/models/user.model'

@Injectable()
export class DataloaderService {
  constructor(
    private usersDataloder: UsersDataloaderService,
    private channelsDataloader: ChannelsDataloaderService
  ) {}

  getLoaders(): Dataloaders {
    const channelsUsersLoader = this.createChannelsUsersLoader()
    const usersChannelsLoader = this.createUsersChannelsLoader()
    const usersOwnerChannelsLoader = this.createUsersOwnerChannelsLoader()

    return {
      channelsUsersLoader,
      usersChannelsLoader,
      usersOwnerChannelsLoader
    }
  }

  private createChannelsUsersLoader() {
    return new DataLoader<ChannelsUsersLoaderArgs, Array<User>>(
      async (props: ChannelsUsersLoaderArgs[]) => {
        const ids = props.map(arg => arg.channelId)
        const { args } = props[0]

        return this.usersDataloder.getChannelsUsersByBatch(ids, args)
      },
      { cache: false }
    )
  }

  private createUsersChannelsLoader() {
    return new DataLoader<UsersChannelsLoaderArgs, Array<Channel>>(
      async (props: UsersChannelsLoaderArgs[]) => {
        const ids = props.map(arg => arg.userId)
        const { currentUserId, args } = props[0]

        return this.channelsDataloader.getUsersChannelsByBatch(
          ids,
          currentUserId,
          args
        )
      },
      { cache: false }
    )
  }

  private createUsersOwnerChannelsLoader() {
    return new DataLoader<UsersChannelsLoaderArgs, Array<Channel>>(
      async (props: UsersChannelsLoaderArgs[]) => {
        const ids = props.map(arg => arg.userId)
        const { currentUserId, args } = props[0]

        return this.channelsDataloader.getUsersOwnerChannelsByBatch(
          ids,
          currentUserId,
          args
        )
      },
      { cache: false }
    )
  }
}
