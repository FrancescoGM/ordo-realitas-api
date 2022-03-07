import { NextFunction, Request, Response } from 'express'

import { ErrorBody } from '@core/infra/HttpResponse'
import { Middleware } from '@core/infra/Middleware'

export function adaptMiddleware(middleware: Middleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestData = {
      accessToken: req.headers?.['x-access-token'],
      ...(req.headers || {}),
    }

    const httpResponse = await middleware.handle(requestData, req.body)

    if (httpResponse === false) {
      return res.status(200).send()
    }

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)

      return next()
    } else {
      return res.status(httpResponse.statusCode).json({
        error: (httpResponse.body as ErrorBody).error,
      })
    }
  }
}
