import Manager from '../../support/Manager';
import { Session, SessionDriver } from './Session';
import { Service } from '../Service';

export default class SessionManager extends Manager<SessionDriver, Session> {
  public getDefaultDriver(): SessionDriver {
    return this.config[Service.Session]!.driver ?? SessionDriver.File;
  }

  public setDefaultDriver(driver: SessionDriver) {
    this.config[Service.Session]!.driver = driver;
  }

  public getSessionConfig() {
    return this.config[Service.Session];
  }

  // public createFileDriver(): Session {
  //   // ...
  // }
  //
  // public createCookieDriver(): Session {
  //   // ...
  // }
  //
  // public createDatabaseDriver(): Session {
  //   // ...
  // }
}
