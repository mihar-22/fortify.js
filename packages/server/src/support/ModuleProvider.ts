import { App } from '../App';
import { Module } from '../modules/Module';

export interface InvalidConfiguration {
  code: string
  message: string
  path?: string
  link?: string
}

export interface ModuleProvider<ConfigType> {
  configValidation?(): InvalidConfiguration | undefined;
  dependencies?(): string[] | void;
  register(): void
  registerTestingEnv?(): void
  boot?(): void
}

export interface ModuleProviderConstructor<ConfigType = any> {
  id: Module
  defaults?(app: App): ConfigType
  new(app: App, config: ConfigType): ModuleProvider<ConfigType>
}
