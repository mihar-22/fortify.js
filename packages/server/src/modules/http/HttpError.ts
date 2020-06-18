export interface HttpError {
  statusCode: number,
  message?: string,
  errors?: string[]
}

export type HttpErrors = { [error: string]: HttpError };
