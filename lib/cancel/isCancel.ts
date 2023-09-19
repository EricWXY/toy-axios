import CancelError from "./CancelError"

export default function isCancel (val: unknown): val is CancelError {
  return val instanceof CancelError && val.__CANCEL__ === true
}