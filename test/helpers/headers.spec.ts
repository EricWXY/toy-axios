import { describe, it, expect } from 'vitest'
import { parseHeaders, processHeaders, flattenHeaders } from '@/helpers/headers'

describe('helpers:header', () => {
  describe('parseHeaders', () => {
    it('should parse headers', () => {
      const date = new Date()
      const parsed = parseHeaders(
        'Date: ' +
          date.toISOString() +
          '\n' +
          'Content-Type: application/json\n' +
          'Connection: keep-alive\n' +
          'Transfer-Encoding: chunked\n' +
          ':aa\r\n' +
          'key:'
      )
      expect(parsed['date']).toEqual(date.toISOString())
      expect(parsed['content-type']).toEqual('application/json')
      expect(parsed['connection']).toEqual('keep-alive')
      expect(parsed['transfer-encoding']).toEqual('chunked')
      expect(parsed['key']).toBe('')
    })

    it('should return empty object if headers is empty string', () => {
      expect(parseHeaders('')).toEqual({})
    })

    it('should use array for set-cookie', () => {
      const parsedZero = parseHeaders('')
      const parsedSingle = parseHeaders('Set-Cookie: key=val;')
      const parsedMulti = parseHeaders('Set-Cookie: key=val;\r\n' + 'Set-Cookie: key2=val2;\r\n')

      expect(parsedZero['set-cookie']).toBeUndefined()
      expect(parsedSingle['set-cookie']).toEqual(['key=val;'])
      expect(parsedMulti['set-cookie']).toEqual(['key=val;', 'key2=val2;'])
    })

    it('should handle duplicates', function () {
      const parsed = parseHeaders(
        'Age: age-a\n' + // age is in ignore duplicates blocklist
          'Age: age-b\n' +
          'Foo: foo-a\n' +
          'Foo: foo-b\n'
      )

      expect(parsed['age']).toEqual('age-a')
      expect(parsed['foo']).toEqual('foo-a, foo-b')
    })
  })

  describe('processHeaders', () => {
    it('should normalize Content-Type header name', () => {
      const headers: Record<string, any> = {
        'content-Type': 'foo/bar',
        'Content-length': 1024
      }
      processHeaders(headers, {})
      expect(headers['Content-Type']).toBe('foo/bar')
      expect(headers['content-type']).toBeUndefined()
      expect(headers['Content-length']).toBe(1024)
    })

    it('should set Content-Type if not set and data is PlainObject', () => {
      const headers: Record<string, any> = {}
      processHeaders(headers, { a: 1 })
      expect(headers['Content-Type']).toBe('application/json;charset=utf-8')
    })

    it('should not set Content-Type if not set and data is not PlainObject', () => {
      const headers: Record<string, any> = {}
      processHeaders(headers, new URLSearchParams('a=b'))
      expect(headers['Content-Type']).toBeUndefined()
    })

    it('should do nothing if headers is undefined or null', () => {
      expect(processHeaders(undefined, {})).toBeUndefined()
      expect(processHeaders(null, {})).toBeNull()
    })
  })

  describe('flattenHeaders', () => {
    it('should flatten the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })

    it('should flatten the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }
      expect(flattenHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    it('should do nothing if headers is undefined or null', () => {
      expect(flattenHeaders(undefined, 'get')).toBeUndefined()
      expect(flattenHeaders(null, 'get')).toBeNull()
    })
  })
})
