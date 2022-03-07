export type ErrorBody = {
  error: string
  name: string
}

export type HttpResponse<TBody = unknown> = {
  statusCode: number
  body: TBody | ErrorBody
}

export function ok<T extends unknown>(dto?: T): HttpResponse<T> {
  return {
    statusCode: 200,
    body: dto,
  }
}

export function created(): HttpResponse<undefined> {
  return {
    statusCode: 201,
    body: undefined,
  }
}

export function clientError(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: {
      error: error.message,
      name: error.name,
    },
  }
}

export function unauthorized(error: Error): HttpResponse {
  return {
    statusCode: 401,
    body: {
      error: error.message,
      name: error.name,
    },
  }
}

export function forbidden(error: Error): HttpResponse {
  return {
    statusCode: 403,
    body: {
      error: error.message,
      name: error.name,
    },
  }
}

export function notFound(error: Error): HttpResponse {
  return {
    statusCode: 404,
    body: {
      error: error.message,
      name: error.name,
    },
  }
}

export function conflict(error: Error): HttpResponse {
  return {
    statusCode: 409,
    body: {
      error: error.message,
      name: error.name,
    },
  }
}

export function fail(error: Error) {
  console.log(error)

  return {
    statusCode: 500,
    body: {
      error: error.message,
      name: error.name,
    },
  }
}
