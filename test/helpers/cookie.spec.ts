import { describe, it, expect } from 'vitest'
import cookie from '@/helpers/cookie'

describe('helpers:cookie', () => {
  it('should read cookie', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('foo')).toBe('bar')
  })

  it('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=bar'
    expect(cookie.read('baz')).toBeNull()
  })
})
