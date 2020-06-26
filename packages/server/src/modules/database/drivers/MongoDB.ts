import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import {
  CreateData, DatabaseDriver,
  DatabaseDriverId, Filter,
  UpdateData,
} from './DatabaseDriver';

export type MongoDBConfig = { uri: string, database: string } & MongoClientOptions;

export class MongoDB implements DatabaseDriver<MongoDBConfig> {
  public id = DatabaseDriverId.MongoDB;

  public config?: MongoDBConfig;

  private client?: MongoClient;

  private db?: Db;

  public getDb(): Db {
    if (!this.client) {
      const mongodb = require('mongodb');
      this.client = new mongodb.MongoClient(this.config!.uri, this.config!);
      this.db = this.client!.db((this.config!.database));
    }

    return this.db!;
  }

  public async create(collection: string, data: CreateData) {
    const res = await this.getDb().collection(collection).insertOne(data);
    return res.insertedId;
  }

  public async read(collection: string, filter: Filter) {
    const res = await this.getDb().collection(collection).find(filter);
    return res?.toArray();
  }

  public async update(collection: string, filter: Filter, data: UpdateData) {
    const res = await this.getDb().collection(collection).updateMany(filter, data);
    return res.modifiedCount;
  }

  public async delete(collection: string, filter: Filter) {
    const res = await this.getDb().collection(collection).deleteMany(filter);
    return res.deletedCount ?? 0;
  }

  public async dropCollection(collection: string) {
    await this.getDb().collection(collection).drop();
  }
}
