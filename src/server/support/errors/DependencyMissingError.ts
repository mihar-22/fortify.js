import { bold, cyan } from 'kleur';
import { existsSync } from 'fs';
import { ServerError } from './ServerError';

export class DependencyMissingError extends Error implements ServerError {
  public code: string;

  public module: string;

  public dependency: string;

  constructor(dependency: string, module: string, isDevDep: boolean) {
    super(undefined);

    this.module = module;
    this.dependency = dependency;
    this.stack = undefined;
    this.code = 'MISSING_DEPENDENCY';
    this.message = 'A required dependency has not been installed.';

    const usingYarn = existsSync(`${process.cwd()}/yarn.lock`);

    const runCommand = usingYarn
      ? `yarn add ${dependency} ${isDevDep ? '-D' : ''}`
      : `npm install ${dependency} ${isDevDep ? '--save-dev' : ''}`;

    this.message = `${bold('Code:')} ${bold().red(this.code)}\n\n`
      + `${bold('Module:')} ${module.toUpperCase()}\n\n`
      + `${bold('Message:')} ${this.message}\n\n`
      + `${bold('Fix:')} ${cyan(runCommand)}`;
  }
}
