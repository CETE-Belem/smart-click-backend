/*
  Warnings:

  - Added the required column `cod_usuario_cadastrou` to the `equipamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "equipamento" ADD COLUMN     "cod_usuario_cadastrou" TEXT NOT NULL,
ALTER COLUMN "cod_usuario" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_usuario_cadastrou_fkey" FOREIGN KEY ("cod_usuario_cadastrou") REFERENCES "usuario"("cod_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
