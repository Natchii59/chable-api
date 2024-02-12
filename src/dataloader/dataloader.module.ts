import { Module } from '@nestjs/common'

import { ChannelsDataloaderService } from '@/dataloader/channels-dataloader.service'
import { UsersDataloaderService } from '@/dataloader/users-dataloader.service'
import { DataloaderService } from './dataloader.service'

@Module({
  providers: [
    DataloaderService,
    UsersDataloaderService,
    ChannelsDataloaderService
  ],
  exports: [DataloaderService]
})
export class DataloaderModule {}
