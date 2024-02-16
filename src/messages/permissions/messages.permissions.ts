import { ChannelType } from '@prisma/client'
import { Actions, InferSubjects, Permissions } from 'nest-casl'

import { Channel } from '@/channels/models/channel.model'
import { Message } from '@/messages/models/message.model'

export type Subjects = InferSubjects<typeof Message | typeof Channel>

export const messagesPermissions: Permissions<null, Subjects, Actions> = {
  everyone({ can, user }) {
    can(Actions.read, Message, {
      'channel.users': { $elemMatch: { id: user.id } }
    })

    can(Actions.create, Channel, {
      users: { $elemMatch: { id: user.id } }
    })

    can(Actions.update, Message, {
      authorId: user.id
    })

    can(Actions.delete, Message, {
      authorId: user.id
    })
    can(Actions.delete, Message, {
      'channel.type': ChannelType.PUBLIC,
      'channel.ownerId': user.id
    })
  }
}
