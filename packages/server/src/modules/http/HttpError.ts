export interface HttpError {
  message?: string
  code?: string
  errors?: string[]
}

export type HttpErrors = { [error: string]: HttpError };
