import { Module } from '@nestjs/common'
import { CaslModule } from 'nest-casl'

import {
  ChannelsFieldsResolver,
  FindChannelsFieldsResolver
} from '@/channels/channels-fields.resolver'
import { ChannelsQueriesResolver } from '@/channels/channels-queries.resolver'
import { channelsPermissions } from '@/channels/permissions/channels.permissions'
import { UsersModule } from '@/users/users.module'
import { ChannelsMutationsResolver } from './channels-mutations.resolver'
import { ChannelsService } from './channels.service'

@Module({
  imports: [
    UsersModule,
    CaslModule.forFeature({ permissions: channelsPermissions })
  ],
  providers: [
    ChannelsService,
    ChannelsMutationsResolver,
    ChannelsQueriesResolver,
    ChannelsFieldsResolver,
    FindChannelsFieldsResolver
  ]
})
export class ChannelsModule {}
