import { Request, Response, NextFunction } from "express";
import { Forbidden, UnAuthenticated } from "../response/http.response";
import * as jwt from "jsonwebtoken";
require("dotenv").config();
console.log(process.env.JWTSECRETKEY);

export const authorization = async (
  request: any,
  response: Response,
  next: NextFunction
) => {
  if (!request.headers.authorization) {
    return UnAuthenticated(response);
  }
  const decodeHeader = jwtVerify(request.headers.authorization);
  if (!decodeHeader) {
    return Forbidden(response);
  }
  console.log(decodeHeader);

  request.user = decodeHeader;

  next();
};
export const jwtVerify = (token: string) => {
  console.log(token);

  return jwt.verify(token, process.env.JWTSECRETKEY || "secret123");
};
