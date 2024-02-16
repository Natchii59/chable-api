import { Module } from '@nestjs/common'

import { ChannelsDataloaderService } from '@/dataloader/channels-dataloader.service'
import { MessagesDataloaderService } from '@/dataloader/messages-dataloader.service'
import { UsersDataloaderService } from '@/dataloader/users-dataloader.service'
import { DataloaderService } from './dataloader.service'

@Module({
  providers: [
    DataloaderService,
    UsersDataloaderService,
    ChannelsDataloaderService,
    MessagesDataloaderService
  ],
  exports: [DataloaderService]
})
export class DataloaderModule {}
