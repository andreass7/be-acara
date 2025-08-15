import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import TicketModel, { ticketDTO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await ticketDTO.validate(req.body);
      const result = await TicketModel.create(req.body);
      response.success(res, result, "success to create a ticket");
    } catch (error) {
      response.error(res, error, "failed to to create a ticket");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TypeTicket> = {};
      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await TicketModel.find(query)
        .populate("events")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await TicketModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        "success to find all ticket"
      );
    } catch (error) {
      response.error(res, error, "failed to find all ticket");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "ticket not found");
      }

      const result = await TicketModel.findById(id);

      if (!result) {
        return response.notFound(res, "ticket not found");
      }

      response.success(res, result, "success to find one ticket");
    } catch (error) {
      response.error(res, error, "failed to find ticket");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed update ticket");
      }

      const result = await TicketModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "success to update ticket");
    } catch (error) {
      response.error(res, error, "failed to update ticket");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed remove ticket");
      }

      const result = await TicketModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "success to Delete ticket");
    } catch (error) {
      response.error(res, error, "failed to remove ticket");
    }
  },
  async findAllByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;
      if (!isValidObjectId(eventId)) {
        return response.error(res, null, "ticket not found");
      }

      const result = await TicketModel.find({ events: eventId }).exec();
      response.success(res, result, "success to find all ticket by an event");
    } catch (error) {
      response.error(res, error, "failed to find all by event ticket");
    }
  },
};
