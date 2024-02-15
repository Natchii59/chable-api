import { DefaultActions } from 'nest-casl'

enum CustomActions {
  join = 'join',
  leave = 'leave'
}

export type ChannelActions = DefaultActions & CustomActions
export const ChannelActions = { ...DefaultActions, ...CustomActions }
