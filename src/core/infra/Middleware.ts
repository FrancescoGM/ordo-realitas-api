import { HttpResponse } from './HttpResponse'

export type Middleware<T = unknown, U = unknown> = {
  handle: (httpRequest: T, httpBody?: U) => Promise<HttpResponse | false>
}
