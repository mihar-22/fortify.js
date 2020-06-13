import { bold, yellow } from 'kleur';
import { ServerError } from './ServerError';

export class ConfigurationError extends Error implements ServerError {
  public code: string;

  public module: string;

  public configPath: string;

  constructor(code: string, message: string, configPath: string, module: string) {
    super(undefined);

    this.code = code;
    this.configPath = configPath;
    this.module = module;
    this.stack = undefined;

    this.message = `${bold('Code:')} ${bold().red(this.code)}\n\n`
      + `${bold('Module:')} ${module.toUpperCase()}\n\n`
      + `${bold('Config Path:')} ${yellow(configPath)}\n\n`
      + `${bold('Message:')} ${message}`;
  }
}
