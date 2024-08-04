/*
  Warnings:

  - You are about to drop the `Unidade_Consumidora` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Unidade_Consumidora" DROP CONSTRAINT "Unidade_Consumidora_cod_concessionaria_fkey";

-- DropForeignKey
ALTER TABLE "Unidade_Consumidora" DROP CONSTRAINT "Unidade_Consumidora_cod_usuario_fkey";

-- DropForeignKey
ALTER TABLE "equipamento" DROP CONSTRAINT "equipamento_cod_unidade_consumidora_fkey";

-- DropTable
DROP TABLE "Unidade_Consumidora";

-- CreateTable
CREATE TABLE "unidade_consumidora" (
    "cod_unidade_consumidora" TEXT NOT NULL,
    "cidade" VARCHAR(200) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "numero" VARCHAR(8) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "cod_concessionaria" TEXT NOT NULL,
    "cod_usuario" TEXT NOT NULL,

    CONSTRAINT "unidade_consumidora_pkey" PRIMARY KEY ("cod_unidade_consumidora")
);

-- CreateTable
CREATE TABLE "unidade_consumidora_usuario" (
    "cod_unidade_consumidora" TEXT NOT NULL,
    "cod_usuario" TEXT NOT NULL,

    CONSTRAINT "unidade_consumidora_usuario_pkey" PRIMARY KEY ("cod_unidade_consumidora","cod_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "unidade_consumidora_numero_key" ON "unidade_consumidora"("numero");

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_unidade_consumidora_fkey" FOREIGN KEY ("cod_unidade_consumidora") REFERENCES "unidade_consumidora"("cod_unidade_consumidora") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_consumidora" ADD CONSTRAINT "unidade_consumidora_cod_concessionaria_fkey" FOREIGN KEY ("cod_concessionaria") REFERENCES "concessionaria"("cod_concessionaria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_consumidora" ADD CONSTRAINT "unidade_consumidora_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_consumidora_usuario" ADD CONSTRAINT "unidade_consumidora_usuario_cod_unidade_consumidora_fkey" FOREIGN KEY ("cod_unidade_consumidora") REFERENCES "unidade_consumidora"("cod_unidade_consumidora") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_consumidora_usuario" ADD CONSTRAINT "unidade_consumidora_usuario_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
