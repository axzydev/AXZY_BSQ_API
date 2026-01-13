import { Router } from "express";
import * as evaluationsController from "./evaluations.controller";

const router = Router();

router.post("/", evaluationsController.createEvaluation);
router.get("/areas", evaluationsController.getTechnicalAreas);
router.get("/:id", evaluationsController.getEvaluationById);
router.get("/:id/pdf", evaluationsController.getEvaluationPDF);
router.get("/child/:childId", evaluationsController.getEvaluationsByChild);

export default router;
