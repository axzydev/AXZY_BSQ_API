import { PrismaClient } from "@prisma/client";

export const evaluationsSeed = async (prisma: PrismaClient) => {
  const areas = [
    "Mecánica de swing",
    "Contacto",
    "Timing",
    "Velocidad de swing",
    "Disciplina en caja",
  ];

  console.log("Seeding Technical Areas...");

  for (const name of areas) {
    await prisma.technicalArea.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
};
