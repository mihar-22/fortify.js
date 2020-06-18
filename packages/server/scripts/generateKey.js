#!/usr/bin/env node

const { randomBytes } = require('crypto');
const { bold } = require('kleur')

console.log(`${bold('Encryption Key:')}`, bold().yellow(randomBytes(32).toString('base64')))



