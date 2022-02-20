import { HttpResponse } from './HttpResponse'

export type Controller<T = unknown> = {
  handle: (request: T) => Promise<HttpResponse>
}
