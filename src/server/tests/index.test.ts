import { randomBytes } from 'crypto';
import serverlessAuth from '../index';
import { Service } from '../services/Service';
import ServerlessProvider from '../ServerlessProvider';
import { Env } from '../Config';

const buildServer = (overrides = {}) => serverlessAuth({
  [Service.Encryption]: { key: randomBytes(32).toString('base64') },
  env: Env.Testing,
  serverlessProvider: ServerlessProvider.Next,
  ...overrides,
});

describe('E2E', () => {
  test('bootstrapping works', async () => {
    await buildServer();
  });

  // test('should throw error given invalid encryption key', () => {
  //   expect(buildServer({ [Service.Encryption]: { key: undefined } }))
  //     .rejects
  //     .toThrowError(EncryptionErrorForHuman[EncryptionError.MissingKey]);
  // });
});
