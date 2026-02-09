import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead } from "./notification.controller";

const router = Router();

// In a real app, use authentication middleware
// GET /notifications/:userId
router.get("/:userId", getNotifications);

// PUT /notifications/:id/read
router.put("/:id/read", markAsRead);

// PUT /notifications/:userId/read-all
router.put("/:userId/read-all", markAllAsRead);

export default router;
