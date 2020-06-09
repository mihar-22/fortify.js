import { HttpError as IHttpError } from '../../modules/http/HttpError';
import { ServerError } from './ServerError';

export class HttpError<T> extends Error implements IHttpError, ServerError<T> {
  public code: string;

  public module: T;

  public statusCode: number;

  public errors?: string[];

  constructor(
    code: string,
    message: string,
    module: T,
    statusCode: number,
    errors?: string[],
  ) {
    super(message);
    this.code = code;
    this.module = module;
    this.statusCode = statusCode;
    this.errors = errors;
  }

  public toJSON(): string {
    return JSON.stringify({
      code: this.code,
      message: this.message,
      module: this.module,
      statusCode: this.statusCode,
      errors: this.errors,
    });
  }
}
