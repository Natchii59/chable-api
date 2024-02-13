import { ChannelType } from '@prisma/client'
import { Actions, InferSubjects, Permissions } from 'nest-casl'

import { Channel } from '@/channels/models/channel.model'

export type Subjects = InferSubjects<typeof Channel>

export const channelsPermissions: Permissions<null, Subjects, Actions> = {
  everyone({ can, cannot, user }) {
    can(Actions.read, Channel, {
      type: ChannelType.PUBLIC
    })
    can(Actions.read, Channel, {
      users: { $elemMatch: { id: user.id } }
    })

    can(Actions.update, Channel, {
      type: ChannelType.GROUP,
      users: { $elemMatch: { id: user.id } }
    })
    can(Actions.update, Channel, {
      type: ChannelType.PUBLIC,
      ownerId: user.id
    })
    cannot(Actions.update, Channel, {
      type: ChannelType.PRIVATE
    })

    can(Actions.delete, Channel, {
      ownerId: user.id
    })
    cannot(Actions.delete, Channel, {
      type: ChannelType.PRIVATE
    })
  }
}
