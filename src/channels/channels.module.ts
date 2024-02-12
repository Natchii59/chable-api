import { Module } from '@nestjs/common'

import {
  ChannelsFieldsResolver,
  FindChannelsFieldsResolver
} from '@/channels/channels-fields.resolver'
import { ChannelsQueriesResolver } from '@/channels/channels-queries.resolver'
import { UsersModule } from '@/users/users.module'
import { ChannelsMutationsResolver } from './channels-mutations.resolver'
import { ChannelsService } from './channels.service'

@Module({
  imports: [UsersModule],
  providers: [
    ChannelsService,
    ChannelsMutationsResolver,
    ChannelsQueriesResolver,
    ChannelsFieldsResolver,
    FindChannelsFieldsResolver
  ]
})
export class ChannelsModule {}
