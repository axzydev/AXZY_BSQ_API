-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PaymentDetail" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
