export enum SocketEvents {
  ERROR = 'error',

  CREATE_CHANNEL_CLIENT = 'create-channel-client',
  UPDATE_CHANNEL_CLIENT = 'update-channel-client',
  DELETE_CHANNEL_CLIENT = 'delete-channel-client',

  JOIN_CHANNEL_CLIENT = 'join-channel-client',
  LEAVE_CHANNEL_CLIENT = 'leave-channel-client',

  JOIN_CHANNEL_ROOM_SERVER = 'join-channel-room-server',
  JOIN_CHANNEL_ROOM_CLIENT = 'join-channel-room-client',
  LEAVE_CHANNEL_ROOM_SERVER = 'leave-channel-room-server',
  LEAVE_CHANNEL_ROOM_CLIENT = 'leave-channel-room-client',

  TYPING_START_SERVER = 'typing-start-server',
  TYPING_START_CLIENT = 'typing-start-client',
  TYPING_STOP_SERVER = 'typing-stop-server',
  TYPING_STOP_CLIENT = 'typing-stop-client'
}
