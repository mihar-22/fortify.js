import { ServerError } from './ServerError';

export class ConfigurationError extends Error implements ServerError {
  public code: string;

  public module: string;

  public configPath: string;

  constructor(code: string, message: string, module: string, configPath: string) {
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
