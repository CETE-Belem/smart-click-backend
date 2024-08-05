/*
  Warnings:

  - You are about to drop the `unidade_consumidora_usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "unidade_consumidora_usuario" DROP CONSTRAINT "unidade_consumidora_usuario_cod_unidade_consumidora_fkey";

-- DropForeignKey
ALTER TABLE "unidade_consumidora_usuario" DROP CONSTRAINT "unidade_consumidora_usuario_cod_usuario_fkey";

-- DropTable
DROP TABLE "unidade_consumidora_usuario";
