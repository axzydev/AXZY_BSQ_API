import { PrismaClient } from "@prisma/client";
import { securitySeed } from "./seeds/security";
import { trainingSeed } from "./seeds/trainingSeed";
import { evaluationsSeed } from "./seeds/evaluationsSeed";

const prisma = new PrismaClient();

async function main() {
  await securitySeed(prisma);
   await trainingSeed(prisma);
   await evaluationsSeed(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
