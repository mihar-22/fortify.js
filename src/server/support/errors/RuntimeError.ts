import ServerError from './ServerError';
import Module from '../../modules/Module';

export default class RuntimeError extends Error implements ServerError {
  public code: string;

  public module: Module;

  constructor(code: string, message: string, module: Module) {
    super(message);
    this.code = code;
    this.module = module;
  }
}
