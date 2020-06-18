export type ErrorCode = string;

export interface ServerError extends Error {
  code: ErrorCode
  message: string
  module: string
  stack?: string
}
