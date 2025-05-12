import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { SECCRET } from "./env";
import { IUserToken } from "./interfaces";

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECCRET, {
    expiresIn: "1h",
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECCRET) as IUserToken;

  return user;
};
