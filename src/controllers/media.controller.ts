import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import uploder from "../utils/uploder";
import response from "../utils/response";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      return response.error(res, null, "File are not exist");
    }

    try {
      const result = await uploder.uploadSingle(
        req.file as Express.Multer.File
      );
      response.success(res, result, "success upload file");
    } catch {
      response.error(res, null, "failed upload file");
    }
  },
  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      return response.error(res, null, "Files are not exist");
    }

    try {
      const result = await uploder.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      response.success(res, result, "success upload file");
    } catch {
      response.error(res, null, "failed upload file");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploder.remove(fileUrl);
      response.success(res, result, "success remove file");
    } catch {
      response.error(res, null, "failed remove file");
    }
  },
};
