import { Method, IHeaders } from '@/types'
import { deepMerge, isPlainObject } from '../utils'

function normalizeHeaderName (headers: IHeaders | undefined | null, normalizedName: string) {
  if (!headers) return
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}
export function processHeaders (
  headers: IHeaders | undefined | null,
  data: unknown
): IHeaders | undefined | null {
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

const ignoreDuplicateOf = new Set([
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent'
])

export function parseHeaders (rawHeaders: string): IHeaders {
  let parsed = Object.create(null)
  if (!rawHeaders) return parsed

  rawHeaders.split('\n').forEach(function parser (line) {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()

    if (!key || (parsed[key] && ignoreDuplicateOf.has(key))) {
      return
    }
    const val = vals.join(':').trim()

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val)
      } else {
        parsed[key] = [val]
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val
    }
  })

  return parsed
}

export function flattenHeaders (
  headers: IHeaders | undefined | null,
  method: Method
): IHeaders | undefined | null {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers![method]
  })
  return headers
}
