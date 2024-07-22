import { Request, Response } from "express";
import { create, get, getDetails, remove, update } from "./client.service";
import { createTResult } from "@src/core/mappers/tresult.mapper";

export const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await get();
    return res.status(200).json(createTResult(clients));
  } catch (error: any) {
    return res.status(500).json(createTResult([], error.message));
  }
};

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await getDetails(Number(id));
    return res.status(200).json(createTResult(client));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const createClient = async (req: Request, res: Response) => {
  try {
    const client = await create(req.body);
    return res.status(201).json(createTResult(client));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await update(Number(id), req.body);
    return res.status(200).json(createTResult(client));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await remove(Number(id));
    return res.status(200).json(createTResult(client));
  } catch (error: any) {
    return res.status(500).json(createTResult(null, error.message));
  }
};
