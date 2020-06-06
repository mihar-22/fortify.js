import ServerError from './ServerError';
import Module from '../../modules/Module';

export default class ConfigurationError extends Error implements ServerError {
  public code: string;

  public module: Module;

  public configPath: string;

  constructor(code: string, message: string, module: Module, configPath: string) {
    super(message);
    this.code = code;
    this.module = module;
    this.configPath = configPath;
  }

  public getHumanReadableError(): string {
    return `The ${this.module} module received an invalid configuration at the path: ${this.configPath}.`
      + `\n Code: ${this.code}`
      + `\n Message: ${this.message}`;
  }
}
