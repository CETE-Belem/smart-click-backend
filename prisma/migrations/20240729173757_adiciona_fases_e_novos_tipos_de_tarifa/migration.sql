/*
  Warnings:

  - The values [BRANCA,CONSTANTE] on the enum `Tipo_Tarifa` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `fases_monitoradas` to the `equipamento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Fases" AS ENUM ('MONOFASE', 'BIFASE', 'TRIFASE');

-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_Tarifa_new" AS ENUM ('INTERMEDIARIA', 'FORA_DE_PONTA', 'PONTA');
ALTER TABLE "intervalo_tarifa" ALTER COLUMN "tipo" TYPE "Tipo_Tarifa_new" USING ("tipo"::text::"Tipo_Tarifa_new");
ALTER TYPE "Tipo_Tarifa" RENAME TO "Tipo_Tarifa_old";
ALTER TYPE "Tipo_Tarifa_new" RENAME TO "Tipo_Tarifa";
DROP TYPE "Tipo_Tarifa_old";
COMMIT;

-- AlterTable
ALTER TABLE "equipamento" ADD COLUMN     "fases_monitoradas" "Fases" NOT NULL;
