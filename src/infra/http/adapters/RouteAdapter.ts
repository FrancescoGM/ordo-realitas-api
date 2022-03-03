import { Request, Response } from 'express'

import { Controller } from '@core/infra/Controller'
import { ErrorBody } from '@core/infra/HttpResponse'

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
        error: (httpResponse.body as ErrorBody).error,
        name: (httpResponse.body as ErrorBody).name,
      })
    }
  }
}
