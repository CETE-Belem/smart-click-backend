/*
  Warnings:

  - You are about to drop the column `criadoPor` on the `concessionaria` table. All the data in the column will be lost.
  - Added the required column `cod_criador` to the `concessionaria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "concessionaria" DROP CONSTRAINT "concessionaria_criadoPor_fkey";

-- AlterTable
ALTER TABLE "concessionaria" DROP COLUMN "criadoPor",
ADD COLUMN     "cod_criador" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "concessionaria" ADD CONSTRAINT "concessionaria_cod_criador_fkey" FOREIGN KEY ("cod_criador") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
