import { bold, yellow } from 'kleur';
import { ServerError } from './ServerError';

export class ConfigurationError extends Error implements ServerError {
  constructor(
    public code: string,
    public message: string,
    public configPath: string,
    public module: string,
    public link?: string,
  ) {
    super(undefined);

    this.stack = undefined;

    this.message = `${bold('Code:')} ${bold().red(this.code)}\n\n`
      + `${bold('Module:')} ${module.toUpperCase()}\n\n`
      + `${bold('Config Path:')} ${yellow(configPath)}\n\n`
      + `${bold('Message:')} ${message}`
      + `${link ? `\n\n${bold('Link:')} ${link}` : ''}`;

    // @see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}
