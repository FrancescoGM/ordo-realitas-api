import { Request, Response } from 'express'

import { Controller } from '@core/infra/Controller'

interface IHttpError {
  body: {
    error: unknown
  }
}

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const requestData = {
      ...req.body,
      ...req.params,
      ...req.query,
      userId: req.userId,
    }

    const httpResponse = await controller.handle(requestData)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      return res.status(httpResponse.statusCode).json({
        error: (httpResponse as IHttpError).body.error,
      })
    }
  }
}
