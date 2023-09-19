import xhrAdapter from './xhr'
import httpAdapter from './http'
import fetchAdapter from './fetch'
import { AxiosRequestConfig } from '@/types'
import * as utils from '@/utils'

const knownAdapters: Record<string, Function | boolean> = {
  xhr: xhrAdapter,
  http: httpAdapter,
  fetch: fetchAdapter
}

type Adapter = AxiosRequestConfig['adapter']

export default {
  getAdapter: (adapters: Array<Adapter> | Adapter) => {
    adapters = utils.isArray(adapters) ? adapters : [adapters]
    const { length } = adapters

    let nameOrAdapter: Adapter
    let adapter: Function | boolean | undefined

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i]
      if (
        (adapter = utils.isString(nameOrAdapter)
          ? knownAdapters[nameOrAdapter.toLowerCase()]
          : nameOrAdapter)
      )
        break
    }

    if (!adapter) {
      if (adapter === false) {
        throw new Error(`Adapter ${nameOrAdapter! as string} is not supported by the environment`)
      }

      throw new Error(
        utils.hasOwnProp(knownAdapters, nameOrAdapter! as string)
          ? `Adapter '${nameOrAdapter!}' is not available in the build`
          : `Unknown adapter '${nameOrAdapter!}'`
      )
    }

    if (!utils.isFunction(adapter)) {
      throw new TypeError('adapter is not a function')
    }

    return adapter
  },
  adapters: knownAdapters
}
