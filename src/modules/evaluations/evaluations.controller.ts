import { Request, Response } from "express";
import * as evaluationsService from "./evaluations.service";
import { generateEvaluationPDF } from "./evaluations.pdf.service";
import { createTResult } from "@src/core/mappers/tresult.mapper";

export const createEvaluation = async (req: Request, res: Response) => {
    try {
        const result = await evaluationsService.createEvaluation(req.body);
        res.status(201).json(createTResult(result));
    } catch (error: any) {
        res.status(500).json(createTResult(null, [error.message]));
    }
};

export const getEvaluationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await evaluationsService.getEvaluationById(Number(id));
        if (!result) {
            res.status(404).json(createTResult(null, ["Evaluación no encontrada"]));
            return;
        }
        res.json(createTResult(result));
    } catch (error: any) {
        res.status(500).json(createTResult(null, [error.message]));
    }
};

export const getEvaluationsByChild = async (req: Request, res: Response) => {
    try {
        const { childId } = req.params;
        const result = await evaluationsService.getEvaluationsByChild(Number(childId));
        res.json(createTResult(result));
    } catch (error: any) {
        res.status(500).json(createTResult(null, [error.message]));
    }
};

export const getTechnicalAreas = async (req: Request, res: Response) => {
    try {
        const result = await evaluationsService.getTechnicalAreas();
        res.json(createTResult(result));
    } catch (error: any) {
         res.status(500).json(createTResult(null, [error.message]));
    }
}

export const getEvaluationPDF = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const evaluation = await evaluationsService.getEvaluationById(Number(id));
        
        if (!evaluation) {
             res.status(404).json(createTResult(null, ["Evaluación no encontrada"]));
             return;
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=reporte_${evaluation.child.name}_${evaluation.id}.pdf`);

        generateEvaluationPDF(evaluation, res);

    } catch (error: any) {
        console.error("Error generating PDF:", error);
         res.status(500).json(createTResult(null, ["Error generating PDF"]));
    }
};
