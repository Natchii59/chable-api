import { ChannelType } from '@prisma/client'
import { InferSubjects, Permissions } from 'nest-casl'

import { Channel } from '@/channels/models/channel.model'
import { ChannelActions } from '@/channels/permissions/channels.actions'

export type Subjects = InferSubjects<typeof Channel>

export const channelsPermissions: Permissions<null, Subjects, ChannelActions> =
  {
    everyone({ can, cannot, user }) {
      can(ChannelActions.read, Channel, {
        type: ChannelType.PUBLIC
      })
      can(ChannelActions.read, Channel, {
        users: { $elemMatch: { id: user.id } }
      })

      can(ChannelActions.update, Channel, {
        type: ChannelType.GROUP,
        users: { $elemMatch: { id: user.id } }
      })
      can(ChannelActions.update, Channel, {
        type: ChannelType.PUBLIC,
        ownerId: user.id
      })
      cannot(ChannelActions.update, Channel, {
        type: ChannelType.PRIVATE
      })

      can(ChannelActions.delete, Channel, {
        ownerId: user.id
      })
      cannot(ChannelActions.delete, Channel, {
        type: ChannelType.PRIVATE
      })

      can(ChannelActions.join, Channel, {
        type: ChannelType.PUBLIC
      })
      can(ChannelActions.join, Channel, {
        type: ChannelType.GROUP,
        users: { $elemMatch: { id: user.id } }
      })
      cannot(ChannelActions.join, Channel, {
        type: ChannelType.PUBLIC,
        users: { $elemMatch: { id: user.id } }
      })
      cannot(ChannelActions.join, Channel, {
        type: ChannelType.PRIVATE
      })

      can(ChannelActions.leave, Channel, {
        users: { $elemMatch: { id: user.id } }
      })
      cannot(ChannelActions.leave, Channel, {
        type: ChannelType.PRIVATE
      })
    }
  }
