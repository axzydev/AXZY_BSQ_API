-- CreateEnum
CREATE TYPE "SwingLevel" AS ENUM ('BASE', 'OPTIMO', 'ELITE');

-- CreateEnum
CREATE TYPE "TechnicalLevel" AS ENUM ('BAJO', 'MEDIO', 'ALTO');

-- CreateEnum
CREATE TYPE "ProgressIndicator" AS ENUM ('PROGRESO', 'ESTABLE', 'ATENCION');

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "childId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" INTEGER,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwingMetric" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "level" "SwingLevel" NOT NULL,
    "speedMph" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SwingMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalArea" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TechnicalArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalRating" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,
    "level" "TechnicalLevel" NOT NULL,
    "indicator" "ProgressIndicator" NOT NULL,

    CONSTRAINT "TechnicalRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentLog" (
    "id" SERIAL NOT NULL,
    "evaluationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "age" INTEGER,
    "comments" TEXT NOT NULL,
    "indicator" "ProgressIndicator" NOT NULL,

    CONSTRAINT "DevelopmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SwingMetric_evaluationId_level_key" ON "SwingMetric"("evaluationId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalArea_name_key" ON "TechnicalArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalRating_evaluationId_areaId_key" ON "TechnicalRating"("evaluationId", "areaId");

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwingMetric" ADD CONSTRAINT "SwingMetric_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalRating" ADD CONSTRAINT "TechnicalRating_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalRating" ADD CONSTRAINT "TechnicalRating_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "TechnicalArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentLog" ADD CONSTRAINT "DevelopmentLog_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
