import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel, {
  userDTO,
  userLoginDTO,
  userUpdatePasswordDTO,
} from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } = req.body;
    try {
      await userDTO.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        email,
        username,
        password,
      });
      response.success(res, result, "success register");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, "failed registration");
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      // ambil data user berdasarkan identifier -> email dan username
      await userLoginDTO.validate({
        identifier,
        password,
      });
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        isActive: true,
      });
      if (!userByIdentifier) {
        return response.unauthorized(res, "User not found");
      }

      // validasi password
      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;

      if (!validatePassword) {
        return response.unauthorized(res, "User Not Found");
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, token, "login success");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, "login failed");
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      response.success(res, result, "success get user");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, "failed get user");
    }
  },
  async activation(req: Request, res: Response) {
    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );
      response.success(res, user, "success activation");
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, "failed activation");
    }
  },

  async updateProfil(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { fullName, profilePicture } = req.body;
      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          profilePicture,
        },
        { new: true }
      );

      if (!result) return response.notFound(res, "failed update profile");

      response.success(res, result, "success update profile");
    } catch (error) {
      response.error(res, error, "failed to update profile");
    }
  },
  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const { oldPassword, password, confirmPassword } = req.body;
      await userUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });
      const user = await UserModel.findById(userId);

      if (!user || user.password !== encrypt(oldPassword))
        return response.notFound(res, "user not found");

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: encrypt(password),
        },
        { new: true }
      );

      response.success(res, result, "success update password");
    } catch (error) {
      response.error(res, error, "failed to update password");
    }
  },
};
