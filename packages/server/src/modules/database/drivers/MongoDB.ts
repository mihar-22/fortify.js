import { Db, MongoClient } from 'mongodb';
import { AbstractDbDriver } from './AbstractDbDriver';
import { DatabaseConfig, DatabaseDriver } from '../DatabaseConfig';
import { DbCollection } from '../DbCollection';
import { CreateData, Filter, UpdateData } from '../Database';

export class MongoDB extends AbstractDbDriver<DatabaseConfig[DatabaseDriver.MongoDB]> {
  public driver = DatabaseDriver.MongoDB;

  protected client?: MongoClient;

  protected db?: Db;

  protected getDb(): Db {
    if (!this.client) {
      const mongodb = require('mongodb');
      this.client = new mongodb.MongoClient(this.config!.uri, this.config!);
      this.db = this.client!.db((this.config!.database));
    }

    return this.db!;
  }

  public async driverCreate(collection: DbCollection, data: CreateData) {
    const res = await this.getDb().collection(collection).insertOne(data);
    return res.insertedId;
  }

  public async driverRead(collection: DbCollection, filter: Filter) {
    const res = await this.getDb().collection(collection).find(filter);
    return res?.toArray();
  }

  public async driverUpdate(collection: DbCollection, filter: Filter, data: UpdateData) {
    const res = await this.getDb().collection(collection).updateMany(filter, data);
    return res.modifiedCount;
  }

  public async driverDelete(collection: DbCollection, filter: Filter) {
    const res = await this.getDb().collection(collection).deleteMany(filter);
    return res.deletedCount ?? 0;
  }
}
