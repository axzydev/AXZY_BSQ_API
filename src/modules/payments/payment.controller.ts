import { createTResult } from "@src/core/mappers/tresult.mapper";
import {
  sendPaymentDetailEmail,
  sendPaymentEmail,
} from "@src/core/utils/emailSender";
import { Request, Response } from "express";
import { getClientDetailsByPaymentId } from "../clients/client.service";
import {
  addDetail,
  create,
  get,
  getById,
  remove,
  removeDetail,
  update,
  updateDetail,
} from "./payments.service";
import { sendMessage } from "@src/core/utils/whatsSender";

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await get();
    return res.status(200).json(createTResult(payments));
  } catch (error: any) {
    return res.status(500).json(createTResult([], error.message));
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await getById(Number(id));
    return res.status(200).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await create(req.body);

    if (!payment) {
      return res
        .status(500)
        .json(createTResult(null, ["Error creating payment"]));
    }

    const client = await getClientDetailsByPaymentId(Number(payment.id));
    if (client) {
      await sendPaymentEmail(
        {
          ...client,
          ...payment,
          concept: payment.invoiceNumber,
        },
        client.email
      );
    }

    return res.status(201).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await update(Number(id), req.body);
    return res.status(200).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await remove(Number(id));
    return res.status(200).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const addPaymentDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await addDetail(Number(id), req.body);

    if (payment) {
      await sendPaymentDetailEmail(payment, payment.payment.client.email);
    } 

    // await sendMessage("526645102632", "hello_world");

    return res.status(200).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const updatePaymentDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await updateDetail(Number(id), req.body);
    return res.status(200).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const deletePaymentDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await removeDetail(Number(id));
    return res.status(200).json(createTResult(payment));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};
