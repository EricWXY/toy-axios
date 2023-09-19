import AxiosError, { ErrorCodes } from '@/core/AxiosError'
import { Cancel as ICancel, AxiosRequestConfig } from '../types'

export default class CancelError extends AxiosError implements ICancel {
   __CANCEL__: boolean
  constructor (public message: string, config: AxiosRequestConfig, request: XMLHttpRequest) {
    super(message ?? 'canceled', ErrorCodes.ERR_CANCELED.value, config, request)
    this.__CANCEL__ = true
  }
}
