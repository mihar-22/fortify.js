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

    // @see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  public toLog(): any {
    return {
      code: this.code,
      message: this.message,
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
