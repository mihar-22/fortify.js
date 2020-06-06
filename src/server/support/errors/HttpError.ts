import { HttpError as IHttpError } from '../../modules/http/HttpError';
import ServerError from './ServerError';
import Module from '../../modules/Module';

export default class HttpError extends Error implements IHttpError, ServerError {
  public code: string;

  public module: Module;

  public statusCode: number;

  public errors?: string[];

  constructor(
    code: string,
    message: string,
    module: Module,
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
