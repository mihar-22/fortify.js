import { DbCollection } from './DbCollection';
import { Dispatcher } from '../events/Dispatcher';

export enum DatabaseEvent {
  Created = 'DB_CREATED',
  Read = 'DB_READ',
  Updated = 'DB_UPDATED',
  Deleted = 'DB_DELETED',
  Executing = 'DB_EXEC'
}

export interface DatabaseEventPayload {
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
  [DatabaseEvent.Executing]: { sql: string, values: string[] }
}

export type DatabaseEventDispatcher = Dispatcher<DatabaseEventPayload>;
