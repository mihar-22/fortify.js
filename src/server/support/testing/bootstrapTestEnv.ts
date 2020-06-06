import 'reflect-metadata';
import { Container } from 'inversify';
import bootstrap from '../../bootstrap';

const testContainer = new Container();

(global as any).testContainer = testContainer;

async function setup() {
  await bootstrap(testContainer);
}

setup();
