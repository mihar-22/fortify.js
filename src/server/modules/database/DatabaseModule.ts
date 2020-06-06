import { AsyncContainerModule } from 'inversify';

const DatabaseModule = new AsyncContainerModule(async () => {
  // ...
});

export default DatabaseModule;
