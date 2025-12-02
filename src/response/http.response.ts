import { Response } from "express";

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
