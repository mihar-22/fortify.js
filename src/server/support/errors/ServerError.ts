export interface ServerError<T> extends Error {
  code: string
  message: string
  module: T
  stack?: string
}
