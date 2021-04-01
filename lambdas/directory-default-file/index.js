'use strict'

const matchDirectoryRegEx = /\/[^\/.]+$/

export const handler = (event, context, callback) => {
  const request = event.Records[0].cf.request
  const uri = request.uri

  const hasTrailingSlash = uri.endsWith('/')
  if (hasTrailingSlash || matchDirectoryRegEx.test(uri)) {
    request.uri += `${hasTrailingSlash ? '' : '/'}index.html`
  }

  return callback(null, request)
}
