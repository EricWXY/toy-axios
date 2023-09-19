import { isArray } from '@/utils'
import { AxiosTransformer, IHeaders } from '@/types'

export default function transform (
  data: unknown,
  headers: IHeaders,
  fns?: AxiosTransformer | AxiosTransformer[]
) {
  if (!fns) return data
  if (!isArray(fns)) fns = [fns as AxiosTransformer]

  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
