import { describe, it, expect, afterAll, afterEach, beforeAll, vi } from 'vitest'
import axios, { AxiosResponse, AxiosError } from '@/index'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer()

describe('requests', () => {
  // 在所有测试之前启动服务器
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

  // 所有测试后关闭服务器
  afterAll(() => server.close())

  // 每次测试后重置处理程序 `对测试隔离很重要`
  afterEach(() => server.resetHandlers())

  it('should treat single string arg as url', () => {
    server.use(
      rest.get('http://foo', (req, res, ctx) => {
        expect(req.url.href).toBe('http://foo/')
        expect(req.method).toBe('GET')
        return res(ctx.status(200), ctx.json({ msg: 'get' }))
      })
    )
    axios('http://foo')
  })

  it('should treat method value as lowercase string', () => {
    server.use(
      rest.post('http://foo', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json({ msg: 'post' }))
      })
    )
    axios({
      url: 'http://foo',
      method: 'POST'
    }).then(res => {
      expect(res.config.method).toBe('POST')
    })
  })

  it('should reject on network errors', () => {
    const resovleSpy = vi.fn((res: AxiosResponse) => res)
    const rejectSpy = vi.fn((err: AxiosError) => err)

    server.use(
      rest.get('http://foo', (_, res) => {
        return res.networkError('Network Error')
      })
    )

    axios('http://foo').then(resovleSpy).catch(rejectSpy).then(next)

    function next (reason: AxiosError | AxiosResponse) {
      expect(resovleSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Network Error')
      expect((reason as AxiosError).request).toEqual(expect.any(XMLHttpRequest))
    }
  })

  it.todo('should reject when request timeout', async () => {})

  it('should reject when validateStatus returns false', () => {
    const resovleSpy = vi.fn((res: AxiosResponse) => res)
    const rejectSpy = vi.fn((err: AxiosError) => err)

    server.use(
      rest.get('http://foo', (_, res, ctx) => {
        return res(ctx.status(500), ctx.json({ msg: 'get' }))
      })
    )

    axios('http://foo', {
      validateStatus (status) {
        return status !== 500
      }
    })
      .then(resovleSpy)
      .catch(rejectSpy)
      .then(next)

    function next (reason: AxiosError | AxiosResponse) {
      expect(resovleSpy).not.toHaveBeenCalled()
      expect(rejectSpy).toHaveBeenCalled()
      expect(reason instanceof Error).toBeTruthy()
      expect((reason as AxiosError).message).toBe('Request failed with status code 500')
      expect((reason as AxiosError).response?.status).toBe(500)
    }
  })

  it('should resolve when validateStatus returns true', () => {
    const resovleSpy = vi.fn((res: AxiosResponse) => res)
    const rejectSpy = vi.fn((err: AxiosError) => err)

    server.use(
      rest.get('http://foo', (_, res, ctx) => {
        return res(ctx.status(500), ctx.json({ msg: 'get' }))
      })
    )

    axios('http://foo', {
      validateStatus (status) {
        return status === 500
      }
    })
      .then(resovleSpy)
      .catch(rejectSpy)
      .then(next)

    function next (reason: AxiosError | AxiosResponse) {
      expect(resovleSpy).toHaveBeenCalled()
      expect(rejectSpy).not.toHaveBeenCalled()
      expect(reason instanceof Error).toBeFalsy()
      expect(reason.config.url).toBe('http://foo')
    }
  })

  it('should return JSON when resolved', () => {
    server.use(
      rest.post('http://foo', (_, res, ctx) => {
        return res(ctx.status(200), ctx.text('{"errno":0}'))
      })
    )

    axios.post('http://foo', {}, { headers: { Accept: 'application/json' } }).then(res => {
      expect(res.data).toEqual({ errno: 0 })
    })
  })

  it('should supply correct response', () => {
    server.use(
      rest.post('http://foo', (_, res, ctx) => {
        return res(ctx.status(200), ctx.text('{"foo": "bar"}'))
      })
    )

    axios.post('http://foo').then(res => {
      expect(res.data.foo).toBe('bar')
      expect(res.status).toBe(200)
      expect(res.statusText).toBe('OK')
    })
  })

  it('should support array buffer response', () => {
    server.use(
      rest.get('http://foo', (_, res, ctx) => {
        return res(ctx.status(200), ctx.json(str2ab('Hello World')))
      })
    )

    function str2ab (str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('http://foo', {
      responseType: 'arraybuffer'
    }).then(res => {
      expect(res.data.byteLength).toBe(2)
    })
  })
})
