import { AxiosRequestConfig, AxiosResponse } from '@/types'
import { buildURL, combineURL, isAbsoluteURL } from '@/helpers/url'
import { flattenHeaders } from '@/helpers/headers'
import transform from './transform'
import adapters from '@/adapters'
import defaults from '@/defaults'

export default function dispatchRequest (config: AxiosRequestConfig) {
  throwIfCancellationRequested(config)
  processConfig(config)
  const adapter = adapters.getAdapter(config?.adapter || defaults.adapter)
  return adapter(config).then((res: AxiosResponse) => transformResponseData(res))
}

function processConfig (config: AxiosRequestConfig) {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers!, config.transformRequest)
  config.headers = flattenHeaders(config.headers!, config.method ?? 'GET')
}

export function transformURL (config: AxiosRequestConfig): string {
  const { url, params, paramsSerializer, baseURL } = config
  const fullPath = baseURL && !isAbsoluteURL(url!) ? combineURL(baseURL, url) : url!

  return buildURL(fullPath, params, paramsSerializer)
}

function transformResponseData (res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested (config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
