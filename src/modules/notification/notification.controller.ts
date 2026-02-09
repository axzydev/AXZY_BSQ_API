import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createTResult } from "@src/core/mappers/tresult.mapper";

const prisma = new PrismaClient();

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params; // Or from req.user if auth middleware is used
    if (!userId) return res.status(400).json(createTResult(null, ["User ID required"]));

    const notifications = await prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    res.json(createTResult(notifications));
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { read: true },
    });
    res.json(createTResult(notification));
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.params;
        await prisma.notification.updateMany({
            where: { userId: Number(userId), read: false },
            data: { read: true }
        });
        res.json(createTResult({ success: true }));
    } catch (error) {
        next(error);
    }
}
