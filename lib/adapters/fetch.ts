import * as utils from '@/utils'
import { AxiosPromise, AxiosRequestConfig } from '@/types'

const isFetchAdapterSupported = typeof fetch !== 'undefined' && utils.isFunction(fetch)

export default isFetchAdapterSupported &&
  function fetchAdapter (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      config
      resolve
      reject
      // @TODO
    })
  }
