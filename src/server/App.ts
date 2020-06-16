import { Container, interfaces } from 'inversify';
import { Config, Env } from './Config';
import { Module } from './modules/Module';
import { DIToken } from './DIToken';

import Newable = interfaces.Newable;
import BindingToSyntax = interfaces.BindingToSyntax;

export class App {
  private readonly env: Env;

  private readonly config: Config;

  private readonly container: Container;

  constructor(config: Config) {
    this.config = config;
    this.env = config?.env ?? Env.Development;
    this.container = new Container();
    this.container.bind<Config>(DIToken.Config).toConstantValue(config);
  }

  public get<T>(token: string): T {
    return this.container.get<T>(token);
  }

  public bind<T>(token: string): BindingToSyntax<T> {
    return this.container.bind<T>(token);
  }

  public rebind<T>(token: string): BindingToSyntax<T> {
    return this.container.rebind<T>(token);
  }

  public resolve<T>(constructorFunction: Newable<T>): T {
    return this.container.resolve<T>(constructorFunction);
  }

  public get isTestingEnv(): boolean {
    return this.env === Env.Testing;
  }

  public get isDevelopmentEnv(): boolean {
    return this.env === Env.Development;
  }

  public get isProductionEnv(): boolean {
    return this.env === Env.Production;
  }

  public configPathExists(...path: string[]): boolean {
    let obj: any = this.config;
    const curr = path;
    // @ts-ignore
    // eslint-disable-next-line no-cond-assign,no-empty
    while (curr.length && obj && (obj = obj[curr.shift()])) {}
    return (curr.length === 0) && !!obj;
  }

  public getConfig<T extends Module>(module: T): Config[T] {
    return this.config[module];
  }

  public setConfig<T extends Module>(module: T, config: Config[T]): void {
    this.config[module] = config;
  }
}
