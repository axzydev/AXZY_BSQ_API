-- DropIndex
DROP INDEX "Client_phoneNumber_email_rfc_key";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "xmlUrl" TEXT;
