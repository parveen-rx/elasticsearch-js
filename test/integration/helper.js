// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

function runInParallel (client, operation, options, clientOptions) {
  if (options.length === 0) return Promise.resolve()
  const operations = options.map(opts => {
    const api = delve(client, operation).bind(client)
    return api(opts, clientOptions)
  })

  return Promise.all(operations)
}

// code from https://github.com/developit/dlv
// needed to support an edge case: `a\.b`
// where `a.b` is a single field: { 'a.b': true }
function delve (obj, key, def, p) {
  p = 0
  // handle the key with a dot inside that is not a part of the path
  // and removes the backslashes from the key
  key = key.split
    ? key.split(/(?<!\\)\./g).map(k => k.replace(/\\/g, ''))
    : key.replace(/\\/g, '')
  while (obj && p < key.length) obj = obj[key[p++]]
  return (obj === undefined || p < key.length) ? def : obj
}

function to (promise) {
  return promise.then(data => [null, data], err => [err, undefined])
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = { runInParallel, delve, to, sleep }
