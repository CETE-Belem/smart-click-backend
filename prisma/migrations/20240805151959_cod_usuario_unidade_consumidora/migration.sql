/*
  Warnings:

  - A unique constraint covering the columns `[cod_usuario]` on the table `unidade_consumidora` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cod_criador` to the `unidade_consumidora` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "unidade_consumidora" DROP CONSTRAINT "unidade_consumidora_cod_usuario_fkey";

-- AlterTable
ALTER TABLE "unidade_consumidora" ADD COLUMN     "cod_criador" TEXT NOT NULL,
ALTER COLUMN "cod_usuario" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "unidade_consumidora_cod_usuario_key" ON "unidade_consumidora"("cod_usuario");

-- AddForeignKey
ALTER TABLE "unidade_consumidora" ADD CONSTRAINT "unidade_consumidora_cod_criador_fkey" FOREIGN KEY ("cod_criador") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_consumidora" ADD CONSTRAINT "unidade_consumidora_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
