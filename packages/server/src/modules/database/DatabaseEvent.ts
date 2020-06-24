import { DbCollection } from './DbCollection';
import { Dispatcher } from '../events/Dispatcher';

export enum DatabaseEvent {
  Connecting = 'DB_CONNECTING',
  Connected = 'DB_CONNECTED',
  ConnectionFailed = 'DB_CONNECTION_FAILED',
  Created = 'DB_CREATED',
  Read = 'DB_READ',
  Updated = 'DB_UPDATED',
  Deleted = 'DB_DELETED',
  Disconnecting = 'DB_DISCONNECTING',
  Disconnected = 'DB_DISCONNECTED'
}

export interface DatabaseEventPayload {
  [DatabaseEvent.Connecting]: void
  [DatabaseEvent.Connected]: void
  [DatabaseEvent.ConnectionFailed]: Error
  [DatabaseEvent.Disconnecting]: void
  [DatabaseEvent.Disconnected]: void
  [DatabaseEvent.Created]: {
    id: string | number,
    collection: DbCollection,
    data: object
  }
  [DatabaseEvent.Read]: {
    collection: DbCollection,
    filter: object,
    select?: object,
    data?: any
  }
  [DatabaseEvent.Updated]: {
    collection: DbCollection,
    filter: object,
    data: object
  }
  [DatabaseEvent.Deleted]: {
    collection: DbCollection,
    filter: object
  }
}

export type DatabaseEventDispatcher = Dispatcher<DatabaseEventPayload>;
