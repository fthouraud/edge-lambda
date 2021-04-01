import EventEmitter from 'events'
import fs from 'fs'

import archiver from 'archiver'
import test from 'ava'
import { stub } from 'sinon'

import { zipFiles } from '../../../cli/utils/zip'

const directoryToZip = '/directory/to/zip'
const archivePath = 'my-archive.zip'
const archiverOptions = { zlib: { level: 9 } }

test.before((t) => {
  t.context = {
    archiverCreateStub: stub(archiver, 'create'),
    createWriteStreamStub: stub(fs, 'createWriteStream'),
    eventEmitter: new EventEmitter(),
  }
  t.context.eventEmitter.pipe = stub()
  t.context.eventEmitter.glob = stub()
  t.context.eventEmitter.finalize = stub()
})

test.beforeEach((t) => {
  t.context.archiverCreateStub.withArgs('zip', archiverOptions).returns(t.context.eventEmitter)
  t.context.createWriteStreamStub.withArgs(archivePath).returns('fake-write-stream')
})

test.afterEach((t) => {
  t.context.archiverCreateStub.reset()
  t.context.createWriteStreamStub.reset()
  t.context.eventEmitter.pipe.reset()
  t.context.eventEmitter.glob.reset()
  t.context.eventEmitter.finalize.reset()
})

test.after((t) => {
  t.context.archiverCreateStub.restore()
  t.context.createWriteStreamStub.restore()
})

test.serial('should throw an error when the directory to zip is missing', async (t) => {
  await t.throwsAsync(zipFiles, { message: 'The directory is mandatory' })
})

test.serial('should throw an error when the archive path is missing', async (t) => {
  await t.throwsAsync(() => zipFiles(directoryToZip), {
    message: 'The archive file path is mandatory',
  })
})

test.serial('should pipe to write stream', async (t) => {
  const zipFilesPromise = zipFiles(directoryToZip, archivePath)

  t.true(t.context.eventEmitter.pipe.calledOnceWithExactly('fake-write-stream'))

  t.context.eventEmitter.emit('finish')

  await t.notThrowsAsync(zipFilesPromise)
})

test.serial('should zip everything into the directory passed by then call finalize', async (t) => {
  const zipFilesPromise = zipFiles(directoryToZip, archivePath)

  t.true(t.context.eventEmitter.glob.calledOnceWithExactly('**', { cwd: directoryToZip }))
  t.true(t.context.eventEmitter.finalize.calledOnce)
  t.true(t.context.eventEmitter.finalize.calledAfter(t.context.eventEmitter.glob))

  t.context.eventEmitter.emit('finish')

  await t.notThrowsAsync(zipFilesPromise)
})

test.serial('should reject on an error event', async (t) => {
  const zipFilesPromise = zipFiles(directoryToZip, archivePath)

  const errorMessage = 'Write error'

  t.context.eventEmitter.emit('error', new Error(errorMessage))

  await t.throwsAsync(zipFilesPromise, { message: errorMessage })
})
