import { ServerError } from './ServerError';

export class RuntimeError<T> extends Error implements ServerError<T> {
  public code: string;

  public module: T;

  constructor(code: string, message: string, module: T) {
    super(message);
    this.code = code;
    this.module = module;
  }
}
