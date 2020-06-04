import { Container } from 'inversify';
import Config from '../Config';
import DI from '../DI';

export default abstract class Manager<DriverEnum extends string, Driver> {
  protected container: Container;

  protected config: Config;

  protected drivers: Record<string, Driver>;

  constructor(container: Container) {
    this.container = container;
    this.config = container.get<Config>(DI.Config);
    this.drivers = {} as Record<string, Driver>;
  }

  protected abstract getDefaultDriver(): DriverEnum;

  protected abstract setDefaultDriver(driver: DriverEnum): void;

  public driver(driver?: DriverEnum): Driver {
    const driverOrDefault = driver ?? this.getDefaultDriver();

    if (!this.drivers[driverOrDefault]) {
      this.drivers[driverOrDefault] = this.createDriver(driverOrDefault);
    }

    return this.drivers[driverOrDefault];
  }

  protected createDriver(driver: DriverEnum): Driver {
    // If we have a driver called `file` then we call `createFileDriver` on the Manager instance.
    const methodName = `create${driver[0].toUpperCase()}${driver.slice(1)}Driver`;

    // Breaking type safety here and embracing some dynamic-goodness.
    // @ts-ignore
    if (this[methodName]) { return this[methodName](); }

    throw Error(`Driver [${driver}] not supported.`);
  }
}
