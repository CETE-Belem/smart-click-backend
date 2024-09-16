/*
  Warnings:

  - You are about to drop the column `cod_concessionaria` on the `equipamento` table. All the data in the column will be lost.
  - You are about to drop the column `cod_usuario` on the `equipamento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "equipamento" DROP CONSTRAINT "equipamento_cod_concessionaria_fkey";

-- DropForeignKey
ALTER TABLE "equipamento" DROP CONSTRAINT "equipamento_cod_usuario_fkey";

-- AlterTable
ALTER TABLE "equipamento" DROP COLUMN "cod_concessionaria",
DROP COLUMN "cod_usuario";
