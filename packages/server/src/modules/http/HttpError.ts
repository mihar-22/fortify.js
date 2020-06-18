export interface HttpError {
  statusCode: number,
  message: string,
  errors?: string[]
  toJSON(): string
}

export type HttpErrors = { [error: string]: HttpError };
