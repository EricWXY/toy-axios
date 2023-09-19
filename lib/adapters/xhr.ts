import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '@/types'
import { parseHeaders } from '@/helpers/headers'
import { createError, ErrorCodes } from '@/core/AxiosError'
import { isURLSameOrigin } from '@/helpers/url'
import { isFormData } from '@/utils'
import settle from '@/core/settle'
import cookie from '@/helpers/cookie'

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined'

export default isXHRAdapterSupported &&
  function xhrAdapter (config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
      const {
        url,
        headers,
        responseType,
        timeout,
        method = 'GET',
        data = null,
        cancelToken,
        withCredentials,
        xsrfCookieName,
        xsrfHeaderName,
        onDownloadProgress,
        onUploadProgress,
        auth
      } = config
      const request = new XMLHttpRequest()

      request.open(method.toUpperCase(), url!, true)

      configureRequest()
      addEvents()
      processHeaders()
      processCancel()

      request.send(data as any)

      function configureRequest () {
        if (responseType) {
          request.responseType = responseType
        }

        if (timeout) {
          request.timeout = timeout
        }

        if (withCredentials) {
          request.withCredentials = withCredentials
        }
      }

      function addEvents () {
        request.onreadystatechange = function handleLoad () {
          if (request.readyState !== 4) return

          if (request.status === 0) {
            return
          }

          const responseHeaders = request.getAllResponseHeaders()
          const responseData = responseType !== 'text' ? request.response : request.responseText
          const response: AxiosResponse = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: parseHeaders(responseHeaders),
            config,
            request
          }
          settle(resolve, reject, response)
        }
        request.onerror = function handleError () {
          reject(createError('Network Error', config, null, request))
        }

        request.ontimeout = function handleTimeout () {
          reject(
            createError(
              `Timeout of ${timeout} ms exceeded`,
              config,
              ErrorCodes.ECONNABORTED.value,
              request
            )
          )
        }

        if (onDownloadProgress) {
          request.onprogress = onDownloadProgress
        }

        if (onUploadProgress) {
          request.upload.onprogress = onUploadProgress
        }
      }

      function processHeaders () {
        if (isFormData(data)) {
          delete headers!['Content-Type']
        }

        if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
          const xsrfValue = cookie.read(xsrfCookieName)
          if (xsrfValue && xsrfHeaderName) {
            headers![xsrfHeaderName] = xsrfValue
          }
        }

        if (auth) {
          headers!['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
        }

        Object.keys(headers!).forEach(name => {
          if (data == null && name.toLocaleLowerCase() === 'content-type') {
            delete headers![name]
          } else {
            request.setRequestHeader(name, headers![name])
          }
        })
      }

      function processCancel () {
        if (cancelToken) {
          cancelToken.promise.then(reason => {
            request.abort()
            reject(reason)
          })
        }
      }
    })
  }
