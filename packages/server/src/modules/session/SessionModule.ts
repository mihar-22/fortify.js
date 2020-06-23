import { ModuleProvider } from '../../support/ModuleProvider';
import { SessionConfig } from './Session';
import { Module } from '../Module';

export class SessionModule implements ModuleProvider<SessionConfig> {
  public static id = Module.Session;

  public register() {
    // ...
  }
}
