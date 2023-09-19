import { describe, it, expect, vi } from 'vitest'
import {
  isArray,
  isDate,
  isPlainObject,
  isFormData,
  isURLSearchParams,
  extend,
  deepMerge
} from '@/utils'

describe('helpers:utils', () => {
  describe('isXX', () => {
    it('should validate Array', () => {
      expect(isArray([])).toBeTruthy()
      expect(isArray('[]')).toBeFalsy()
      expect(isArray(document.all)).toBeFalsy()
    })

    it('should validate Date', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate(Date.now())).toBeFalsy()
    })

    it('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(new Date())).toBeFalsy()
      expect(isPlainObject(null)).toBeFalsy()
    })

    it('should validate FormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData(void 0)).toBeFalsy()
      expect(isFormData({})).toBeFalsy()
    })

    it('should validate URLSearchParams', () => {
      expect(isURLSearchParams(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParams(void 0)).toBeFalsy()
      expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    it('should be mutabel', () => {
      const a = Object.create(null)
      const b = { foo: 123 }

      extend(a, b)
      expect(a.foo).toBe(123)
    })

    it('should extend properties', () => {
      const a = { foo: 123, bar: 456 }
      const b = { bar: 789 }
      const c = extend(a, b)

      expect(c.foo).toBe(123)
      expect(c.bar).toBe(789)
    })

    it('should extend function', () => {
      const fn = vi.fn(function (this: Record<string, any>) {
        // do something
        expect(this).toBe(b)
      })
      const a = { foo: 'bar' }
      const b = { fn }
      const c = extend(a, b, b)

      c.fn()
    })
  })

  describe('deepMerge', () => {
    it('should be immutable', () => {
      const a = Object.create(null)
      const b: any = { foo: 123 }
      const c: any = { bar: 456 }
      deepMerge(a, b, c)

      expect(a.foo).toBeUndefined()
      expect(a.bar).toBeUndefined()
      expect(b.bar).toBeUndefined()
      expect(c.foo).toBeUndefined()
    })

    it('should deepMerge properties', () => {
      const a = { foo: 123 }
      const b = { bar: 456 }
      const c = { foo: 789 }
      const d = deepMerge(a, b, c)

      expect(d.foo).toBe(789)
      expect(d.bar).toBe(456)
    })

    it('should deepMerge recursively', () => {
      const a = { foo: { bar: 123 } }
      const b = { foo: { baz: 456 }, bar: { qux: 789 } }
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: {
          bar: 123,
          baz: 456
        },
        bar: {
          qux: 789
        }
      })
    })

    it('should remove all references from nested object', () => {
      const a = { foo: { bar: 123 } }
      const b = {}
      const c = deepMerge(a, b)

      expect(c).toEqual({
        foo: { bar: 123 }
      })
      expect(c.foo).not.toBe(a.foo)
    })

    it('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge(undefined, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ bar: 234 }, undefined)).toEqual({ bar: 234 })

      expect(deepMerge(null, undefined)).toEqual({})
      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge(null, { foo: 123 })).toEqual({ foo: 123 })
      expect(deepMerge({ bar: 234 }, null)).toEqual({ bar: 234 })
    })
  })
})
