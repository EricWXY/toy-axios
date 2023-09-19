import { AxiosRequestConfig, AxiosPromise } from '@/types'
import * as utils from '@/utils'

const isHttpAdapterSupported = typeof process !== 'undefined' && utils.kindOf(process) === 'process'

export default isHttpAdapterSupported &&
  function httpAdapter (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      config
      resolve
      reject
      // @TODO
    })
  }
