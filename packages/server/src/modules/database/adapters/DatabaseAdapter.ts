export interface DatabaseAdapter {
  connect(): Promise<void>
  disconnect(): Promise<void>
  hasConnected(): boolean
  // simple type mappings??
  create(collection: string, data: object): Promise<void>
  read(collection: string, filter: object): Promise<void>
  update(collection: string, id: string, data: object): Promise<void>
  delete(collection: string, id: string): Promise<void>
}
