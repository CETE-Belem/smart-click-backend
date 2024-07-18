-- DropIndex
DROP INDEX "Codigo_Confirmacao_codigo_key";

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "contaConfirmada" BOOLEAN DEFAULT false;
