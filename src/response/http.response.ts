import { Response } from "express";

export const Ok = (response: Response, message?: string, body?: any) => {
  return response.send({
    status: true,
    message: message ? message : null,
    result: body ? body : null,
  });
};

export const BadRequest = (response: Response, body?: any): Response => {
  return body
    ? response.status(400).send({
        status: false,
        errors: body && Array.isArray(body) ? body : [body],
      })
    : response.status(400).send({ status: false });
};

export const ApiUnAuthenticated = (
  response: Response,
  message: string = ""
): Response => {
  return response.status(401).send({
    status: false,
    errors: [
      {
        message: message ? message : "Api token is not authenticated",
        detail: "No valid access token provided",
      },
    ],
  });
};

export const UnAuthenticated = (
  response: Response,
  message: string = ""
): Response => {
  return response.status(401).send({
    status: false,
    errors: [
      {
        message: message ? message : "User is not authenticated",
        detail: "No valid access token provided",
      },
    ],
  });
};

export const Forbidden = (
  response: Response,
  message: string = ""
): Response => {
  return response.status(403).send({
    status: false,
    errors: [
      {
        message: message ? message : "Access denied",
        detail: `The user is trying to access a resource that he doesn't has the right to access`,
      },
    ],
  });
};

export const NotFound = (response: Response, body?: any): Response => {
  return body
    ? response.status(404).send({
        status: false,
        errors: body && Array.isArray(body) ? body : body ? body : [body],
      })
    : response.status(404).send({ status: false });
};

export const InternalServer = (
  response: Response,
  error: string | Error
): Response => {
  return response.status(500).send({
    status: false,
    errors: [
      {
        message: "Internal server error",
        detail: typeof error === "string" ? error : error.message,
      },
    ],
  });
};

export const HandleAllError = (
  response: Response,
  error: Error | any
): Response => {
  let statusCode = 500;
  let errors = [];
  let message = "Internal server error";
  if (error.response && error.response.data && error.response.data.error) {
    error = error.response.data.error;
    statusCode = error.code;
    message = error.message;
    errors = error.errors;
  } else {
    statusCode = error.statusCode ? error.statusCode : 500;
    message = error.name;
    errors.push({
      message: message,
      detail:
        error.statusCode != 500
          ? error.message
            ? error.message
            : null
          : error.error,
    });
  }
  let obj = {
    status: false,
    errors: errors,
  };

  return response.status(statusCode).send(obj);
};
