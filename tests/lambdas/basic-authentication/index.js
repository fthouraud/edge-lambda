import test from 'ava'
import { fake } from 'sinon'

import { handler, UnauthorizedResponse } from '../../../lambdas/basic-authentication'

test('should return the request when authentication hash are equal', (t) => {
  const request = createCloudFrontRequest('dGVzdDp0ZXN0Cg==')
  const callback = fake()

  handler(request, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, request.Records[0].cf.request))
})

test('should return an unauthorized response when the authentication hash are different', (t) => {
  const request = createCloudFrontRequest('badAuthentication')
  const callback = fake()

  handler(request, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, UnauthorizedResponse))
})

test('should return an unauthorized response when the authentication hash is undefined', (t) => {
  const request = createCloudFrontRequest()
  const callback = fake()

  handler(request, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, UnauthorizedResponse))
})

test('should return an unauthorized response when the authorization header is missing', (t) => {
  const request = {
    Records: [
      {
        cf: {
          request: {
            headers: {},
          },
        },
      },
    ],
  }
  const callback = fake()

  handler(request, undefined, callback)

  t.true(callback.calledOnceWithExactly(null, UnauthorizedResponse))
})

const createCloudFrontRequest = (authorizationHash) => ({
  Records: [
    {
      cf: {
        request: {
          headers: {
            authorization: [
              {
                key: 'Authorization',
                value: authorizationHash ? `Basic ${authorizationHash}` : undefined,
              },
            ],
          },
        },
      },
    },
  ],
})
