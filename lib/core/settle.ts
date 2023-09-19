import { AxiosResponse } from '@/types'
import AxiosError, { createError, ErrorCodes } from './AxiosError'

export default function settle (
  resolve: (value: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void,
  reject: (reason?: AxiosError) => void,
  response: AxiosResponse
) {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject(
      createError(
        `Request failed with status code ${response.status}`,
        response.config,
        [ErrorCodes.ERR_BAD_REQUEST.value, ErrorCodes.ERR_BAD_RESPONSE.value][
          Math.floor(response.status / 100) - 4
        ],
        response.request,
        response
      )
    )
  }
}
