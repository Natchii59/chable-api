import { Module } from '@nestjs/common'
import { CaslModule } from 'nest-casl'

import {
  ChannelsFieldsResolver,
  FindChannelsFieldsResolver
} from '@/channels/channels-fields.resolver'
import { ChannelsQueriesResolver } from '@/channels/channels-queries.resolver'
import { channelsPermissions } from '@/channels/permissions/channels.permissions'
import { ChannelsMutationsResolver } from './channels-mutations.resolver'
import { ChannelsService } from './channels.service'

@Module({
  imports: [CaslModule.forFeature({ permissions: channelsPermissions })],
  providers: [
    ChannelsService,
    ChannelsMutationsResolver,
    ChannelsQueriesResolver,
    ChannelsFieldsResolver,
    FindChannelsFieldsResolver
  ],
  exports: [ChannelsService]
})
export class ChannelsModule {}
