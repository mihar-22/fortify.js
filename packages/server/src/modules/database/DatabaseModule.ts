import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { DatabaseConfig } from './DatabaseConfig';

export const DatabaseModule: ModuleProvider<DatabaseConfig> = {
  module: Module.Database,

  register: (app: App) => {
    // ...
  },
};
