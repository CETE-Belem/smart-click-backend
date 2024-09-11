/*
  Warnings:

  - Added the required column `atualizadoEm` to the `intervalo_tarifa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `tarifa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "intervalo_tarifa" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "tarifa" ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
