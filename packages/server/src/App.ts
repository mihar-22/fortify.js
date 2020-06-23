/* eslint-disable import/order */

import { container, instanceCachingFactory } from 'tsyringe';
import { Config, Env } from './Config';
import { Module } from './modules/Module';
import { DIToken } from './DIToken';
import constructor from 'tsyringe/dist/typings/types/constructor';

export enum BindingScope {
  Transient = 0,
  Singleton = 1,
  ResolutionScoped = 2,
  ContainerScoped = 3
}

export class App {
  private readonly env: Env;

  private config?: Config;

  private container?: typeof container;

  constructor(config: Config) {
    this.config = config;
    this.env = config.env ?? Env.Development;
    this.container = container.createChildContainer();
    this.container.register(DIToken.Config, { useValue: config });
  }

  public clone(): App {
    const clone = new App(this.config!);
    clone.container = this.container!.createChildContainer();
    return clone;
  }

  public get<T>(token: string | constructor<T>): T {
    return this.container!.resolve<T>(token);
  }

  public bindValue<T>(token: string, value: T) {
    this.container!.register<T>(token, { useValue: value });
  }

  public bindBuilder<T extends (...args: any[]) => any>(token: string, factory: T) {
    this.container!.register<T>(token, { useFactory: instanceCachingFactory(factory) });
  }

  public bindFactory<T extends (...args: any[]) => any>(token: string, factory: T) {
    this.container!.register<T>(token, { useFactory: () => factory });
  }

  public bindClass<T>(token: string, clazz: constructor<T>, scope?: BindingScope) {
    this.container!.register<T>(
      token,
      clazz,
      { lifecycle: (scope ?? BindingScope.Singleton) as any },
    );
  }

  public destroy(): void {
    this.container!.reset();
    this.config = undefined;
    this.container = undefined;
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

  public getConfig<T extends Module>(mod: T): Config[T] {
    return this.config![mod];
  }

  public setConfig<T extends Module>(mod: T, config: Config[T]): void {
    this.config![mod] = config;
  }
}
