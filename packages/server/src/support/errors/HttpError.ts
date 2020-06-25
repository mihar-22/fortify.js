import { HttpErrorResponse as IHttpError } from '../../modules/http/HttpErrorResponse';
import { ServerError } from './ServerError';

export class HttpError extends Error implements IHttpError, ServerError {
  constructor(
    public code: string,
    public message: string,
    public module: string,
    public statusCode: number,
    public errors?: string[],
  ) {
    super(message);

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
