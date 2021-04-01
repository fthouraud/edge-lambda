import test from 'ava'
import { fake } from 'sinon'

import { handler } from '../lib'

test('should rewrite request URI when path is a directory', (t) => {
  const event = createCloudFrontRequest('/foo')
  const callback = fake()

  const expectedRequest = { uri: '/foo/index.html' }

  handler(event, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, expectedRequest))
})

test('should avoid double /', (t) => {
  const event = createCloudFrontRequest('/foo/')
  const callback = fake()

  const expectedRequest = { uri: '/foo/index.html' }

  handler(event, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, expectedRequest))
})

test('should not rewrite an URI with a dot', (t) => {
  const event = createCloudFrontRequest('/foo/bar.anything')
  const callback = fake()

  handler(event, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, event.Records[0].cf.request))
})

test('should ignore intermediate folder even containing a dot', (t) => {
  const event = createCloudFrontRequest('/foo.anything/bar')
  const callback = fake()

  handler(event, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, event.Records[0].cf.request))
})

const createCloudFrontRequest = (uri) => ({
  Records: [
    {
      cf: {
        request: {
          uri,
        },
      },
    },
  ],
})
