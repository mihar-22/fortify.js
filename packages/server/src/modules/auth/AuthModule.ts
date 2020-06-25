import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';

export class AuthModule implements ModuleProvider<undefined> {
  public static id = Module.Auth;

  constructor(
    private readonly app: App,
    private readonly config: undefined,
  ) {}

  public register() {
    // ...
  }
}
