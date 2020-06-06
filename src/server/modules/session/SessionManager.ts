import Manager from '../../support/Manager';
import { Session, SessionDriver } from './Session';
import { Module } from '../Module';

export default class SessionManager extends Manager<SessionDriver, Session> {
  public getDefaultDriver(): SessionDriver {
    return this.config[Service.Session]!.driver!;
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
