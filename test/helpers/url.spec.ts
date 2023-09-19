import { buildURL, isAbsoluteURL, combineURL, isURLSameOrigin } from '@/helpers/url'
import { describe, it, expect, vi } from 'vitest'

describe('helpers:url', () => {
  describe('buildURL', () => {
    it('should support null params', () => {
      expect(buildURL('/foo')).toBe('/foo')
    })

    it('should support params', () => {
      expect(buildURL('/foo', { bar: 'baz' })).toBe('/foo?bar=baz')
    })

    it('should ignore if some param value is null', () => {
      expect(buildURL('/foo', { bar: 'baz', x: null })).toBe('/foo?bar=baz')
    })

    it('should ignore if the only param vlaue is null', () => {
      expect(buildURL('/foo', { bar: null })).toBe('/foo')
    })

    it('should support object params', () => {
      expect(
        buildURL('/foo', {
          foo: {
            bar: 'baz'
          }
        })
      ).toBe('/foo?foo=' + encodeURI('{"bar":"baz"}'))
    })

    it('should support date params', () => {
      const date = new Date()

      expect(
        buildURL('/foo', {
          date
        })
      ).toBe('/foo?date=' + date.toISOString())
    })

    it('should support array params', () => {
      expect(
        buildURL('/foo', {
          foo: ['bar', 'baz']
        })
      ).toBe('/foo?foo[]=bar&foo[]=baz')
    })

    it('should support special char params', () => {
      expect(
        buildURL('/foo', {
          foo: '@:$, '
        })
      ).toBe('/foo?foo=@:$,+')
    })

    it('should support existing params', () => {
      expect(
        buildURL('/foo?foo=bar', {
          bar: 'baz'
        })
      ).toBe('/foo?foo=bar&bar=baz')
    })

    it('should correct discard url hash mark', () => {
      expect(
        buildURL('/foo?foo=bar#hash', {
          query: 'baz'
        })
      ).toBe('/foo?foo=bar&query=baz')
    })

    it('should use serializer if proyided', () => {
      const serializer = vi.fn(params => {
        const result: string[] = []
        for (let key in params) {
          result.push(key)
          result.push(params[key])
        }
        return result.join(',')
      })
      const params = { foo: 'baz' }
      expect(buildURL('/foo', params, serializer)).toBe('/foo?foo,baz')
      expect(serializer).toHaveBeenCalled()
      expect(serializer).toHaveBeenCalledWith(params)
    })

    it('should support URLSearchParams', () => {
      expect(buildURL('/foo', new URLSearchParams('bar=baz'))).toBe('/foo?bar=baz')
    })
  })

  describe('isAbsoluteURL', () => {
    it('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })

    it('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    it('should return true if URL is protocel-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })

    it('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo/')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })

  describe('combineURL', () => {
    it('should combine URL', () => {
      expect(combineURL('https://api.github.com', '/users')).toBe('https://api.github.com/users')
    })

    it('should remove deplicate slashed', () => {
      expect(combineURL('https://api.github.com/', '/users')).toBe('https://api.github.com/users')
    })

    it('should insert missing slash', () => {
      expect(combineURL('https://api.github.com', 'users')).toBe('https://api.github.com/users')
    })

    it('should not insert slash when relative url missing/empty', () => {
      expect(combineURL('https://api.github.com', '')).toBe('https://api.github.com')
    })

    it('should allow a single slash for relative url', () => {
      expect(combineURL('https://api.github.com', '/')).toBe('https://api.github.com/')
    })
  })

  describe('isURLSameOrigin', () => {
    it('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    it('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })
})
