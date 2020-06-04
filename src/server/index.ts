import 'reflect-metadata';
import { Container } from 'inversify';
import Config, { Env } from './Config';
import bootstrap from './bootstrap';

const container = new Container();

export default async function serverlessAuth(config: Config) {
  // If no serverless provider defined throw error.
  if (config.env === Env.Testing) { container.unbindAll(); }
  await bootstrap(container, config);
  // const router = (resolve router);
  // return router.handler;
}
