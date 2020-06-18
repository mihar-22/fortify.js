export enum SessionDriver {
  File = 'file',
  Database = 'database',
  Cookie = 'cookie'
}

export interface SessionConfig {
  driver: SessionDriver
}

export interface Session {
}
