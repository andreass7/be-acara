import { Types } from "mongoose";
import { User } from "../models/user.model";
import { Request } from "express";
// import { IUserToken } from "../utils/jwt";

export interface IReqUser extends Request {
  user?: IUserToken;
}
export interface IUserToken
  extends Omit<
    User,
    | "password"
    | "activationCode"
    | "isActive"
    | "email"
    | "fullName"
    | "profilePicture"
    | "username"
  > {
  id?: Types.ObjectId;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}
