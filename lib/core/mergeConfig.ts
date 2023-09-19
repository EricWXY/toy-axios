import { deepMerge, isPlainObject } from '@/utils'
import { AxiosRequestConfig } from '@/types'

interface StratFn {
  (val1: unknown, val2: unknown): any
}

const defaultStrat: StratFn = (val1, val2) => {
  return val2 ?? val1
}

const fromVal2Strat: StratFn = (_, val2) => {
  if (typeof val2 != null) {
    return val2
  }
}

const deepMergeStrat: StratFn = (val1, val2) => {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  }
  if (val2 != null) {
    return val2
  }
  if (isPlainObject(val1)) {
    return deepMerge(val1)
  }
  if (val1 != null) {
    return val1
  }
}

const stratMap = new Map<string, StratFn>()

const stratKeysFromVal2 = ['url', 'params', 'data']
const stratKeysDeepMerge = ['headers', 'auth']

stratKeysFromVal2.forEach(key => stratMap.set(key, fromVal2Strat))
stratKeysDeepMerge.forEach(key => stratMap.set(key, deepMergeStrat))

export default function mergeConfig (
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config: Record<string, any> = {}
  const mergeField = (key: string): void => {
    const strat = stratMap.get(key) ?? defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  return config
}
