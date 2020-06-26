export enum DatabaseError {
  MemoryDriverUsedInProduction = 'NO_MEM_DRIVER_PROD',
  MigrationFailed = 'MIGRATION_FAILED',
  MissingDriverConfig = 'MISSING_DRIVER_CONFIG'
}
