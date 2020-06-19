import { HttpError as IHttpError } from '../../modules/http/HttpError';
import { ServerError } from './ServerError';

export class HttpError extends Error implements IHttpError, ServerError {
  public code: string;

  public module: string;

  public statusCode: number;

  public errors?: string[];

  constructor(
    code: string,
    message: string,
    module: string,
    statusCode: number,
    errors?: string[],
  ) {
    super(message);
    this.code = code;
    this.module = module;
    this.stack = undefined;
    this.statusCode = statusCode;
    this.errors = errors;
  }

  public toLog(): any {
    return {
      code: this.code,
      module: this.module,
      statusCode: this.statusCode,
      errors: this.errors ?? [],
    };
  }

  public toResponse(): IHttpError {
    return {
      code: this.code,
      message: this.message,
      errors: this.errors,
    };
  }
}
