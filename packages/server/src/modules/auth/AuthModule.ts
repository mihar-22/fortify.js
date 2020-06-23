import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';

export class AuthModule implements ModuleProvider<undefined> {
  public static id = Module.Auth;

  private readonly app: App;

  private readonly config: undefined;

  constructor(app: App, config: undefined) {
    this.app = app;
    this.config = config;
  }

  public register() {
    // ...
  }
}
