/*
  Warnings:

  - Changed the type of `subgrupo` on the `equipamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subgrupo` on the `tarifa` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Subgrupo" AS ENUM ('A1', 'A2', 'A3', 'A4', 'A3a', 'AS');

-- AlterTable
ALTER TABLE "equipamento" DROP COLUMN "subgrupo",
ADD COLUMN     "subgrupo" "Subgrupo" NOT NULL;

-- AlterTable
ALTER TABLE "tarifa" DROP COLUMN "subgrupo",
ADD COLUMN     "subgrupo" "Subgrupo" NOT NULL;
