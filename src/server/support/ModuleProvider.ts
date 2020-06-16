import { App } from '../App';
import { Module } from '../modules/Module';

export interface InvalidConfiguration {
  code: string
  message: string
  path?: string
  link?: string
}

export interface ModuleProvider<ConfigType> {
  module: Module;
  defaults?: (app: App) => ConfigType;
  configValidation?: (app: App) => InvalidConfiguration | undefined;
  dependencies?: (app: App) => string[];
  register: (app: App) => void
  registerTestingEnv?: (app: App) => void
  boot?: (app: App) => Promise<void>
}
