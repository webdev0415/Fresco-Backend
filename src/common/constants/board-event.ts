export enum BoardEventEnum {
  CREATE = 'create',
  MOVE = 'move',
  UPDATE = 'update',
  DELETE = 'delete',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  JOIN_BOARD = 'joinBoard',
  LEAVE_BOARD = 'leaveBoard',
}

export enum BoardMessageEventEnum {
    CREATE_MESSAGE = 'createMessage',
    UPDATE_MESSAGE = 'updateMessage',
    DELETE_MESSAGE = 'deleteMessage',
}
