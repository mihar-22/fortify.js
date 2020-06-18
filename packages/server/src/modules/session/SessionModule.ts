import { ModuleProvider } from '../../support/ModuleProvider';
import { SessionConfig } from './Session';
import { Module } from '../Module';
import { App } from '../../App';

export const SessionModule: ModuleProvider<SessionConfig> = {
  module: Module.Session,

  register: (app: App) => {
    // ...
  },
};
