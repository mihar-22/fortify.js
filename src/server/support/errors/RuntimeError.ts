import { ServerError } from './ServerError';

export class RuntimeError extends Error implements ServerError {
  public code: string;

  public module: string;

  constructor(code: string, message: string, module: string) {
    super(message);
    this.code = code;
    this.module = module;
  }
}
