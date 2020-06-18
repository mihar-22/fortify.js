import { bold, cyan } from 'kleur';
import { existsSync } from 'fs';
import { ServerError } from './ServerError';

export class DependenciesMissingError extends Error implements ServerError {
  public code: string;

  public module: string;

  public dependencies: string[];

  constructor(dependencies: string[], module: string, isDevDep: boolean) {
    super(undefined);

    this.module = module;
    this.dependencies = dependencies;
    this.stack = undefined;
    this.code = 'MISSING_DEPENDENCIES';
    this.message = 'A required dependency has not been installed.';

    const usingYarn = existsSync(`${process.cwd()}/yarn.lock`);

    const runCommand = usingYarn
      ? `yarn add ${dependencies.join(' ')} ${isDevDep ? '-D' : ''}`
      : `npm install ${dependencies.join(' ')} ${isDevDep ? '--save-dev' : ''}`;

    this.message = `${bold('Code:')} ${bold().red(this.code)}\n\n`
      + `${bold('Module:')} ${module.toUpperCase()}\n\n`
      + `${bold('Message:')} ${this.message}\n\n`
      + `${bold('Fix:')} ${cyan(runCommand)}`;
  }
}
