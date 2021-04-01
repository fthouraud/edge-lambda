'use strict'

import config from './config.json'

export const handler = (event, context, callback) => {
  const request = event.Records[0].cf.request
  const authorization = getAuthorizationHeaderValue(request)

  return callback(null, isAuthorizationValid(authorization) ? request : UnauthorizedResponse)
}

const getAuthorizationHeaderValue = (request) => {
  const authorization = request?.headers?.authorization?.[0]?.value
  return authorization ? authorization.replace('Basic ', '') : undefined
}

const isAuthorizationValid = (authorizationToValidate) =>
  authorizationToValidate && authorizationToValidate === config.authorization

export const UnauthorizedResponse = {
  status: '401',
  statusDescription: 'Unauthorized',
  body: 'Unauthorized',
  headers: {
    'www-authenticate': [
      {
        key: 'WWW-Authenticate',
        value: `Basic realm="${config.authenticationRealm}"`,
      },
    ],
  },
}
