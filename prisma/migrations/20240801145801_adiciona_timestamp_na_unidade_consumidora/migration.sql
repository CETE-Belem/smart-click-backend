/*
  Warnings:

  - Added the required column `atualizadoEm` to the `Unidade_Consumidora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unidade_Consumidora" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
