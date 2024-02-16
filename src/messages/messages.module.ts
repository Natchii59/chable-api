import { Module } from '@nestjs/common'
import { CaslModule } from 'nest-casl'

import {
  FindMessagesFieldsResolver,
  MessagesFieldsResolver
} from '@/messages/messages-fields.resolver'
import { MessagesQueriesResolver } from '@/messages/messages-queries.resolver'
import { messagesPermissions } from '@/messages/permissions/messages.permissions'
import { MessagesMutationsResolver } from './messages-mutations.resolver'
import { MessagesService } from './messages.service'

@Module({
  imports: [CaslModule.forFeature({ permissions: messagesPermissions })],
  providers: [
    MessagesService,
    MessagesMutationsResolver,
    MessagesQueriesResolver,
    MessagesFieldsResolver,
    FindMessagesFieldsResolver
  ]
})
export class MessagesModule {}
