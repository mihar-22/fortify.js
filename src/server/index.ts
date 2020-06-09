import 'reflect-metadata';
import { Container } from 'inversify';
import { Config } from './Config';
import { bootstrap } from './bootstrap';

const container = new Container();

export default async function serverlessAuth(config?: Config) {
  await bootstrap(container, config);
  // router can be Koa or Apollo graphql.
  // const router = (resolve router);
  // return router.handler;
}
