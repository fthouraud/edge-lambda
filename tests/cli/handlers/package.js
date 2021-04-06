import test from 'ava'
import { spy, stub } from 'sinon'

import * as pathUtils from '../../../cli/utils/path'
import * as zipUtils from '../../../cli/utils/zip'
import * as checksumUtils from '../../../cli/utils/checksum'
import handler from '../../../cli/handlers/package'

test.before((t) => {
  t.context = {
    getLambdaDistributionDirectoryStub: stub(pathUtils, 'getLambdaDistributionDirectory'),
    getLambdaZipFileStub: stub(pathUtils, 'getLambdaZipFile'),
    zipFilesStub: stub(zipUtils, 'zipFiles'),
    computeFileChecksumStub: stub(checksumUtils, 'computeFileChecksum'),
    logSpy: spy(console, 'log'),
  }
})

test.afterEach((t) => {
  t.context.getLambdaDistributionDirectoryStub.reset()
  t.context.getLambdaZipFileStub.reset()
  t.context.zipFilesStub.reset()
  t.context.computeFileChecksumStub.reset()
  t.context.logSpy.resetHistory()
})

test.after((t) => {
  t.context.getLambdaDistributionDirectoryStub.restore()
  t.context.getLambdaZipFileStub.restore()
  t.context.zipFilesStub.restore()
  t.context.computeFileChecksumStub.restore()
  t.context.logSpy.restore()
})

test("should zip the lambda package then calculate the archive's checksum", async (t) => {
  const lambdaToPack = 'my-awesome-lambda'

  const lambdaDirectory = '/foo/bar/my-awesome-lambda'
  t.context.getLambdaDistributionDirectoryStub.returns(lambdaDirectory)

  const lambdaZip = 'my-awesome-lambda.zip'
  t.context.getLambdaZipFileStub.returns(lambdaZip)

  t.context.zipFilesStub.resolves()

  const archiveChecksum = '6b78ec240ee24e22a5401d9cfd4e37ae'
  t.context.computeFileChecksumStub.resolves(archiveChecksum)

  await t.notThrowsAsync(handler({ lambdaToPack }))

  t.true(t.context.getLambdaDistributionDirectoryStub.calledOnceWithExactly(lambdaToPack))

  t.true(t.context.getLambdaZipFileStub.calledOnceWithExactly(lambdaToPack))

  t.true(t.context.logSpy.calledWithExactly("Packaging 'my-awesome-lambda' lambda"))

  t.true(t.context.zipFilesStub.calledOnceWithExactly(lambdaDirectory, lambdaZip))

  t.true(t.context.computeFileChecksumStub.calledOnceWithExactly(lambdaZip))

  t.true(t.context.logSpy.calledWithExactly("Archive's checksum is: 6b78ec240ee24e22a5401d9cfd4e37ae"))
})
