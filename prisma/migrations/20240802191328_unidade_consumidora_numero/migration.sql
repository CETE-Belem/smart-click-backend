/*
  Warnings:

  - Added the required column `numero` to the `Unidade_Consumidora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Unidade_Consumidora" ADD COLUMN     "numero" VARCHAR(8) NOT NULL;
