#!/usr/bin/env node

import { readdir } from 'fs/promises'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import packageHandler from './handlers/package'
import { directories } from './utils/path'

yargs(hideBin(process.argv)).command(
  'package [lambdaToPack]',
  'package a lambda',
  async (argv) => {
    argv.positional('lambdaToPack', {
      describe: 'the lambda to package',
      choices: [await readdir(directories.lambdas)],
    })
  },
  packageHandler
).argv
