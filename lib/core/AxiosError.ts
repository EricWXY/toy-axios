import {
  AxiosErrorCode,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError as IAxiosError
} from '@/types'
import * as utils from '@/utils'

export default class AxiosError extends Error implements IAxiosError {
  isAxiosError: boolean

  constructor (
    message: string,
    public code: AxiosErrorCode | null,
    public config: AxiosRequestConfig,
    public request?: XMLHttpRequest,
    public response?: AxiosResponse
  ) {
    super(message)

    if (utils.isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = new Error().stack
    }

    this.isAxiosError = true
    Object.setPrototypeOf(this, AxiosError.prototype) // 继承内置对象 需要做的操作
  }

  toJSON () {
    return {
      message: this.message,
      name: this.name,

      stack: this.stack,
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: (this.response && this.response.status) ?? null
    }
  }
}

const descriptors: Record<string, { value: AxiosErrorCode }> = {}

;[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
].forEach(code => {
  descriptors[code as AxiosErrorCode] = { value: code as AxiosErrorCode }
})

Object.defineProperties(AxiosError, descriptors)

function createError (
  message: string,
  config: AxiosRequestConfig,
  code: AxiosErrorCode | null,
  request?: XMLHttpRequest,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, code, config, request, response)
  return error
}

export { descriptors as ErrorCodes, createError }
