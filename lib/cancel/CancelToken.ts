import { CancelExecutor, CancelTokenSource, Canceler, CancelToken as ICancelToken } from '../types'
import CancelError from './CancelError'

interface ResolvePromise {
  (reason?: CancelError): void
}

export default class CancelToken implements ICancelToken {
  promise: Promise<CancelError>
  reason?: CancelError
  constructor (executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<CancelError>(resolve => {
      resolvePromise = resolve as ResolvePromise
    })
    executor((message, config, request) => {
      if (this.reason) return
      this.reason = new CancelError(message, config, request)
      resolvePromise(this.reason)
    })
  }

  throwIfRequested () {
    if (this.reason) throw this.reason
  }

  static source (): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
