import { Response } from "express";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";
import OrderModel, {
  orderDAO,
  OrderStatus,
  TypeOrder,
  TypeVoucher,
} from "../models/order.model";
import TicketModel from "../models/ticket.model";
import { FilterQuery } from "mongoose";
import { getId } from "../utils/id";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const payload = {
        ...req.body,
        createdBy: userId,
      } as TypeOrder;

      await orderDAO.validate(payload);

      const ticket = await TicketModel.findById(payload.ticket);

      if (!ticket) return response.notFound(res, "ticket not found");

      if (ticket.quantity < payload.quantity) {
        return response.error(res, null, "ticket quantity not enough");
      }

      const total: number = +ticket?.price * +payload.quantity;
      Object.assign(payload, {
        ...payload,
        total,
      });

      const result = await OrderModel.create(payload);
      response.success(res, result, "success to create an order");
    } catch (error) {
      response.error(res, error, "failed to create an order");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeOrder> = {};

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await OrderModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "success fetch all order"
      );
    } catch (error) {
      response.error(res, error, "failed find all order");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findOne({
        orderId,
      });

      if (!result) return response.notFound(res, "order not found");

      response.success(res, result, "success find one order");
    } catch (error) {
      response.error(res, error, "failed to find one order");
    }
  },
  async findAllByMember(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeOrder> = {
          createdBy: userId,
        };

        if (filter.search) query.$text = { $search: filter.search };

        return query;
      };

      const { limit = 10, page = 1, search } = req.query;

      const query = buildQuery({
        search,
      });

      const result = await OrderModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await OrderModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "success fetch all order"
      );
    } catch (error) {
      response.error(res, error, "failed find all order");
    }
  },

  async complete(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await OrderModel.findOne({
        orderId,
        createdBy: userId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === OrderStatus.COMPLETED)
        return response.error(res, null, "you have been completed an order");

      const voucher: TypeVoucher[] = Array.from(
        { length: order.quantity },
        () => {
          return { isPrint: false, voucherId: getId() } as TypeVoucher;
        }
      );

      const result = await OrderModel.findOneAndUpdate(
        {
          orderId,
          createdBy: userId,
        },
        {
          voucher,
          status: OrderStatus.COMPLETED,
        },
        {
          new: true,
        }
      );

      const ticket = await TicketModel.findById(order.ticket);

      if (!ticket) return response.notFound(res, "ticket not found");
      await TicketModel.updateOne(
        {
          _id: ticket._id,
        },
        { quantity: ticket.quantity - order.quantity }
      );
      response.success(res, result, "success to complete an order");
    } catch (error) {
      response.error(res, error, "failed to complete order");
    }
  },
  async pending(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findOne({
        orderId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === OrderStatus.COMPLETED) {
        return response.error(res, null, "this order has been completed");
      }

      if (order.status === OrderStatus.PENDING) {
        return response.error(
          res,
          null,
          "this order currently payment in pending"
        );
      }

      const result = await OrderModel.findOneAndUpdate(
        { orderId },
        {
          status: OrderStatus.PENDING,
        },
        {
          new: true,
        }
      );
      response.success(res, result, "success to pending an order");
    } catch (error) {
      response.error(res, error, "failed to pending an order");
    }
  },
  async cancelled(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findOne({
        orderId,
      });

      if (!order) return response.notFound(res, "order not found");

      if (order.status === OrderStatus.COMPLETED) {
        return response.error(res, null, "this order has been completed");
      }

      if (order.status === OrderStatus.CANCELLED) {
        return response.error(
          res,
          null,
          "this order currently payment in cancelled"
        );
      }

      const result = await OrderModel.findOneAndUpdate(
        { orderId },
        {
          status: OrderStatus.CANCELLED,
        },
        {
          new: true,
        }
      );
      response.success(res, result, "success to cancel an order");
    } catch (error) {
      response.error(res, error, "failed to cancel an order");
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { orderId } = req.params;
      const result = await OrderModel.findOneAndDelete({
        orderId,
      });

      if (!result) return response.notFound(res, "order not found");

      response.success(res, result, "success find one order");
    } catch (error) {
      response.error(res, error, "failed to find one order");
    }
  },
};
