import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  Axios as IAxios,
  RejectedFn,
  ResolvedFn
} from '@/types'
import dispatchRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChainNode<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

type PromiseChain<T> = PromiseChainNode<T>[]

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig
  interceptors: Interceptors

  constructor (initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
    this._forEachMethodNoData()
    this._forEachMethodWithData()
  }
  request (url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): AxiosPromise {
    if (typeof url === 'string') {
      ;(config as AxiosRequestConfig).url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)
    const chain: PromiseChain<any> = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    this.interceptors.request.forEach(interceptor => chain.unshift(interceptor))
    this.interceptors.response.forEach(interceptor => chain.push(interceptor))

    let promise = Promise.resolve(config) as AxiosPromise<AxiosRequestConfig>

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise
  }

  getUri (config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  private _forEachMethodNoData () {
    ;(['delete', 'get', 'head', 'options'] as Method[]).forEach(method => {
      ;(Axios.prototype as Record<string, any>)[method] = (
        url: string,
        config: AxiosRequestConfig
      ) => this.request(mergeConfig(config || {}, { method, url }))
    })
  }

  private _forEachMethodWithData () {
    ;(['post', 'put', 'patch'] as Method[]).forEach(method => {
      const generateHTTPMethod = (isForm?: boolean) => {
        return (url: string, data: unknown, config: AxiosRequestConfig) =>
          this.request(
            mergeConfig(config || {}, {
              method,
              url,
              data,
              headers: isForm
                ? {
                    'Content-Type': 'multipart/form-data'
                  }
                : {}
            })
          )
      }
      ;(Axios.prototype as Record<string, any>)[method] = generateHTTPMethod()
      ;(Axios.prototype as Record<string, any>)[method + 'Form'] = generateHTTPMethod(true)
    })
  }
}
