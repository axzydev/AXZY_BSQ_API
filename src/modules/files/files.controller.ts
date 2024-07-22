import { uploadFile } from "@src/core/config/aws";
import { createTResult } from "@src/core/mappers/tresult.mapper";
import { Request, Response } from "express";

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const { file } = req.files as any;

    if (!file) {
      return res
        .status(400)
        .json({ error: "No se ha seleccionado un archivo" });
    }

    const { size } = file;
    if (size > 1024 * 1024) {
      return res
        .status(400)
        .json({ error: "El archivo seleccionado es demasiado grande" });
    }

    const { name } = file;
    const nameSplit = name.split(".");
    const extension = nameSplit[nameSplit.length - 1].toLowerCase();

    const validExtensions = ["pdf", "xml"];

    if (!validExtensions.includes(extension)) {
      return res
        .status(400)
        .json({ error: "El archivo seleccionado no es un PDF o XML válido" });
    }

    const url = await uploadFile(file);

    if (!url) {
      return res.status(500).json({ error: "Error al subir el archivo" });
    }

    return res.status(200).json(createTResult<string>(url));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
