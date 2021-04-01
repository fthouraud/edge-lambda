import path from 'path'

import test from 'ava'
import { match, stub } from 'sinon'

import { getLambdaDistributionDirectory, getLambdaZipFile } from '../../../cli/utils/path'

test.before((t) => {
  t.context = {
    joinStub: stub(path, 'join'),
  }
})

test.afterEach((t) => {
  t.context.joinStub.reset()
})

test.after((t) => {
  t.context.joinStub.restore()
})

test.serial("should return lambda distribution's directory", (t) => {
  const lambdaName = 'my-lambda'

  t.context.joinStub.returns('expected/path')

  const lambdaDistributionDirectory = getLambdaDistributionDirectory(lambdaName)

  t.true(t.context.joinStub.calledOnceWithExactly(match(/\/distribution$/), lambdaName))

  t.is(lambdaDistributionDirectory, 'expected/path')
})

test.serial("should return lambda package's file", (t) => {
  const lambdaName = 'my-lambda'

  t.context.joinStub.returns('expected/archive.zip')

  const lambdaDistributionDirectory = getLambdaZipFile(lambdaName)

  t.true(t.context.joinStub.calledOnceWithExactly(match(/\/packages$/), 'my-lambda-lambda.zip'))

  t.is(lambdaDistributionDirectory, 'expected/archive.zip')
})
