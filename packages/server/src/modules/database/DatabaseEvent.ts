import { DbCollection } from './DbCollection';
import { Dispatcher } from '../events/Dispatcher';

export enum DatabaseEvent {
  Connecting = 'DB_CONNECTING',
  Connected = 'DB_CONNECTED',
  ConnectionFailed = 'DB_CONNECTION_FAILED',
  Create = 'DB_CREATE',
  Read = 'DB_READ',
  Update = 'DB_UPDATE',
  Delete = 'DB_DELETE',
  Disconnecting = 'DB_DISCONNECTING',
  Disconnected = 'DB_DISCONNECTED'
}

export interface DatabaseEventPayload {
  [DatabaseEvent.Connecting]: void
  [DatabaseEvent.Connected]: void
  [DatabaseEvent.ConnectionFailed]: Error
  [DatabaseEvent.Disconnecting]: void
  [DatabaseEvent.Disconnected]: void
  [DatabaseEvent.Create]: {
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
  [DatabaseEvent.Update]: {
    collection: DbCollection,
    filter: object,
    data: object
  }
  [DatabaseEvent.Delete]: {
    collection: DbCollection,
    filter: object
  }
}

export type DatabaseEventDispatcher = Dispatcher<DatabaseEventPayload>;
