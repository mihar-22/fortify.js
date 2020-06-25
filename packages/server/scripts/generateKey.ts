import { randomBytes } from 'crypto';
import { bold } from 'kleur';

console.log(`${bold('Encryption Key:')}`, bold().yellow(randomBytes(32).toString('base64')));
