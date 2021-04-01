import crypto from 'crypto'
import EventEmitter from 'events'
import fs from 'fs'

import test from 'ava'
import { fake, spy, stub } from 'sinon'

import { computeFileChecksum } from '../../../cli/utils/checksum'

const path = '/valid/path'
const encodingOptions = { encoding: 'utf-8' }

test.before((t) => {
  t.context = {
    createHashStub: stub(crypto, 'createHash'),
    createReadStreamStub: stub(fs, 'createReadStream'),
    existsSyncStub: stub(fs, 'existsSync'),
    eventEmitter: new EventEmitter(),
  }
})

test.beforeEach((t) => {
  t.context.md5HashMock = {
    update: spy(),
    digest: fake.returns(Buffer.alloc(13, 'fake-checksum')),
  }
  t.context.createHashStub.withArgs('md5', encodingOptions).returns(t.context.md5HashMock)
  t.context.createReadStreamStub.withArgs(path, encodingOptions).returns(t.context.eventEmitter)
})

test.afterEach((t) => {
  t.context.createHashStub.reset()
  t.context.createReadStreamStub.reset()
  t.context.existsSyncStub.reset()
})

test.after((t) => {
  t.context.createHashStub.restore()
  t.context.createReadStreamStub.restore()
  t.context.existsSyncStub.restore()
})

test.serial('should throw an error when no path is passed', async (t) => {
  await t.throwsAsync(computeFileChecksum, { message: 'An absolute path is required' })
})

test.serial('should throw an error when the path does not exist', async (t) => {
  const invalidPath = 'invalid/path'

  t.context.existsSyncStub.withArgs(invalidPath).returns(false)

  await t.throwsAsync(() => computeFileChecksum(invalidPath), {
    message: 'This file does not seem to exist: invalid/path',
  })
})

test.serial('should throw an error when the reading stream emit an error', async (t) => {
  t.context.existsSyncStub.withArgs(path).returns(true)

  const errorMessage = 'Read error.'

  const checksumPromise = computeFileChecksum(path)

  t.context.eventEmitter.emit('error', new Error(errorMessage))

  await t.throwsAsync(checksumPromise, { message: errorMessage })
})

test.serial('should append data upon reception', async (t) => {
  t.context.existsSyncStub.withArgs(path).returns(true)

  // eslint-disable-next-line no-unused-vars
  const checksumPromise = computeFileChecksum(path)

  t.context.eventEmitter.emit('data', 'some bits...')
  t.context.eventEmitter.emit('data', 'more bits...')

  t.true(t.context.md5HashMock.update.calledTwice)
  t.true(t.context.md5HashMock.update.calledWithExactly('some bits...'))
  t.true(t.context.md5HashMock.update.calledWithExactly('more bits...'))

  t.context.eventEmitter.emit('close')

  await t.notThrowsAsync(checksumPromise)
})

test.serial('should resolve once the close event is emitted', async (t) => {
  t.context.existsSyncStub.withArgs(path).returns(true)

  const checksumPromise = computeFileChecksum(path)

  t.context.eventEmitter.emit('close')

  t.true(t.context.md5HashMock.digest.calledOnceWithExactly('hex'))

  return checksumPromise.then((checksum) => t.is(checksum, 'fake-checksum'))
})
