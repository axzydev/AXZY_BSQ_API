import Router from "express";
import {
  addPaymentDetail,
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  updatePaymentDetail,
} from "./payment.controller";

const router = Router();

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.post("/:id/detail", addPaymentDetail);
router.put("/detail/:id", updatePaymentDetail);
router.delete("/detail/:id", updatePaymentDetail);
export default router;
