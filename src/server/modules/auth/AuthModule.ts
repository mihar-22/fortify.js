import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';

export const AuthModule: ModuleProvider<undefined> = {
  module: Module.Auth,

  register: (app: App) => {
    // ...
  },
};
