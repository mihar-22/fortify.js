import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { DatabaseConfig } from './DatabaseConfig';

export class DatabaseModule implements ModuleProvider<DatabaseConfig> {
  public static id = Module.Database;

  private readonly app: App;

  private readonly config: DatabaseConfig;

  constructor(app: App, config: DatabaseConfig) {
    this.app = app;
    this.config = config;
  }

  public register() {
    // ...
  }
}
