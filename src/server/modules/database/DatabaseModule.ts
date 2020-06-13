import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';

export const DatabaseModule: ModuleProvider<undefined> = {
  module: Module.Database,

  register: (app: App) => {
    // ...
  },
};
