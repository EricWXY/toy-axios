export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'

export type IHeaders = Record<string, any>
export type Params = Record<string, any>

export interface AxiosRequestConfig {
  method?: Method
  url?: string
  data?: unknown
  params?: Params
  headers?: IHeaders | null
  responseType?: XMLHttpRequestResponseType
  timeout?: number
  baseURL?: string
  adapter?: 'http' | 'xhr' | 'fetch' | Function

  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]

  cancelToken?: CancelToken

  withCredentials?: boolean

  xsrfCookieName?: string
  xsrfHeaderName?: string

  auth?: AxiosBasicCredentials

  validateStatus?: (status: number) => boolean

  paramsSerializer?: (params: Params) => string

  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void

  [k: string]: any
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: IHeaders
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: AxiosErrorCode | null
  request?: XMLHttpRequest
  response?: AxiosResponse
}

export type AxiosErrorCode =
  | 'ERR_BAD_OPTION_VALUE'
  | 'ERR_BAD_OPTION'
  | 'ECONNABORTED'
  | 'ETIMEDOUT'
  | 'ERR_NETWORK'
  | 'ERR_FR_TOO_MANY_REDIRECTS'
  | 'ERR_DEPRECATED'
  | 'ERR_BAD_RESPONSE'
  | 'ERR_BAD_REQUEST'
  | 'ERR_CANCELED'
  | 'ERR_NOT_SUPPORT'
  | 'ERR_INVALID_URL'

export interface Axios {
  defaults: AxiosRequestConfig

  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  CancelError: CancelStatic
  isCancel: (val: unknown) => val is Cancel
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic

  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>

  postForm<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  putForm<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
  patchForm<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (err: any): any
}

export interface AxiosTransformer {
  (data: unknown, headers: IHeaders): any
}

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  (message: string, config: AxiosRequestConfig, request: XMLHttpRequest): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message: string, config: AxiosRequestConfig, request: XMLHttpRequest): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}

declare const axios: AxiosStatic;

export default axios;