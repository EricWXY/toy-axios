const objToString = Object.prototype.toString

const { toString } = Object.prototype
const { getPrototypeOf } = Object

export const kindOf = (cache => (thing: unknown) => {
  const str = toString.call(thing)
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase())
})(Object.create(null))

function kindOfTest (type: string) {
  type = type.toLowerCase()
  return (thing: unknown) => kindOf(thing) === type
}

const typeOfTest = (type: string) => (thing: unknown) => typeof thing === type

export const hasOwnProp = (
  ({ hasOwnProperty }) =>
  (obj: Object, prop: string) =>
    hasOwnProperty.call(obj, prop)
)(Object.prototype)

export const isArray = <T = any>(val: unknown): val is Array<T> => Array.isArray(val)

export const isUndefined = typeOfTest('undefined') as (val: unknown) => val is undefined

export const isNil = (val: unknown): boolean => val == null

export const isBuffer = (val: unknown): val is Buffer =>
  !isNil(val) &&
  !isNil(val?.constructor) &&
  isFunction((val!.constructor as BufferConstructor).isBuffer) &&
  (val!.constructor as BufferConstructor).isBuffer(val)

export const isArrayBuffer = kindOfTest('ArrayBuffer') as (val: unknown) => val is ArrayBuffer

export function isArrayBufferView (val: unknown): val is ArrayBufferView {
  let result: boolean
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val)
  } else {
    result =
      !isNil(val) &&
      !isNil((val as ArrayBufferView)?.buffer) &&
      isArrayBuffer((val as ArrayBufferView)!.buffer)
  }
  return result
}

export const isString = typeOfTest('string') as (val: unknown) => val is string

export const isFunction = typeOfTest('function') as (val: unknown) => val is Function

export const isNumber = typeOfTest('number') as (val: unknown) => val is number

export const isObject = (val: unknown): val is Object => val !== null && typeof val === 'object'

export function isPlainObject (val: unknown): boolean {
  if (kindOf(val) !== 'object') {
    return false
  }
  const prototype = getPrototypeOf(val)
  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in (val as Object)) &&
    !(Symbol.iterator in (val as Object))
  )
}

export function isDate (val: unknown): val is Date {
  return objToString.call(val) === '[object Date]'
}

export function isFormData (val: unknown): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData
}

export function isURLSearchParams (val: unknown): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams
}

function _bind (fn: Function, thisArg: unknown) {
  return function wrap () {
    return fn.apply(thisArg, arguments)
  }
}

export function extend<T, U> (to: T, from: U, thisArg?: unknown): T & U {
  for (const key in from) {
    if (thisArg && typeof from[key] === 'function') {
      ;(to as T & U)[key] = _bind(from[key] as Function, thisArg) as any
    } else {
      ;(to as T & U)[key] = from[key] as any
    }
  }

  return to as T & U
}

export function deepMerge (...args: any[]) {
  const result = Object.create(null)

  const assignValue = (val: unknown, key: string) => {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = deepMerge(result[key], val)
    } else if (isPlainObject(val)) {
      result[key] = deepMerge({}, val)
    } else {
      result[key] = val
    }
  }

  for (let i = 0; i < args.length; i++) {
    const obj = args[i]
    for (let key in obj) {
      assignValue(obj[key], key)
    }
  }

  return result
}

export function toJSONObject<T = Object> (obj: T) {
  const stack = new Array(10)

  const visit = (source: T, i: number) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) return

      if (!('toJSON' in source)) {
        stack[i] = source
        const target: Record<string | number, any> = isArray(source) ? [] : {}
        for (let key in source) {
          const value = (source as Record<string, any>)[key]

          const reducedValue = visit(value, i + 1)
          !isUndefined(reducedValue) && (target[key] = reducedValue)
        }
        stack[i] = undefined
        return target
      }
    }

    return source
  }
  return visit(obj, 0)
}
