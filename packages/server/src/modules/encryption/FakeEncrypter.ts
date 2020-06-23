import { injectable } from 'tsyringe';
import { Encrypter } from './Encrypter';

@injectable()
export class FakeEncrypter implements Encrypter {
  public encrypt = jest.fn();

  public decrypt = jest.fn();
}
