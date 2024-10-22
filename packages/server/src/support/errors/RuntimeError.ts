import { bold } from 'kleur';
import { ServerError } from './ServerError';

export class RuntimeError extends Error implements ServerError {
  constructor(
    public code: string,
    public message: string,
    public module: string,
    public reference?: Error,
    public possibleReasons: string[] = [],
  ) {
    super(undefined);
    this.stack = undefined;

    this.message = `${bold('Code:')} ${bold().red(code)}\n\n`
      + `${bold('Module:')} ${module.toUpperCase()}\n\n`
      + `${bold('Description:')} ${message}`
      + `${
        (possibleReasons!.length > 0)
          ? `\n\n${bold('Possible Reasons:')} ${JSON.stringify(possibleReasons, undefined, 2)}\n\n`
          : '\n\n'
      }`
      + `${reference ? `${bold('Stack Trace:')} ${reference.stack}` : ''}`;

    // @see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, RuntimeError.prototype);
  }
}
