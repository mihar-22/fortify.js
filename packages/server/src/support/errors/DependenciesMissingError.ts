import { bold, cyan } from 'kleur';
import { existsSync } from 'fs';
import { ServerError } from './ServerError';

export class DependenciesMissingError extends Error implements ServerError {
  public code: string;

  constructor(
    public dependencies: string[] = [],
    public isDevDep = false,
  ) {
    super(undefined);

    this.stack = undefined;
    this.code = 'MISSING_DEPENDENCIES';
    this.message = 'Required dependencies have not been installed.';

    const usingYarn = existsSync(`${process.cwd()}/yarn.lock`);

    const runCommand = usingYarn
      ? `yarn add ${dependencies.join(' ')} ${isDevDep ? '-D' : ''}`
      : `npm install ${dependencies.join(' ')} ${isDevDep ? '--save-dev' : ''}`;

    this.message = `${bold('Code:')} ${bold().red(this.code)}\n\n`
      + `${bold('Message:')} ${this.message}\n\n`
      + `${bold('Fix:')} ${cyan(runCommand)}`;

    // @see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, DependenciesMissingError.prototype);
  }
}
