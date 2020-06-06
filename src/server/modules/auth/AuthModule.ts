import { AsyncContainerModule } from 'inversify';

const AuthModule = new AsyncContainerModule(async () => {
  // ...
});

export default AuthModule;
