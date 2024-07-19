/*
  Warnings:

  - Added the required column `atualizadoEm` to the `concessionaria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criadoPor` to the `concessionaria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "concessionaria" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "criadoPor" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "concessionaria" ADD CONSTRAINT "concessionaria_criadoPor_fkey" FOREIGN KEY ("criadoPor") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
