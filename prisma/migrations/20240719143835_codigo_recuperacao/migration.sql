/*
  Warnings:

  - You are about to drop the `Codigo_Confirmacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Codigo_Confirmacao" DROP CONSTRAINT "Codigo_Confirmacao_cod_usuario_fkey";

-- DropTable
DROP TABLE "Codigo_Confirmacao";

-- CreateTable
CREATE TABLE "codigo_confirmacao" (
    "cod_codigo" TEXT NOT NULL,
    "codigo" VARCHAR(6) NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "cod_usuario" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "codigo_confirmacao_pkey" PRIMARY KEY ("cod_codigo")
);

-- CreateTable
CREATE TABLE "codigo_recuperacao" (
    "cod_codigo" TEXT NOT NULL,
    "codigo" VARCHAR(6) NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "cod_usuario" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "codigo_recuperacao_pkey" PRIMARY KEY ("cod_codigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "codigo_confirmacao_cod_usuario_key" ON "codigo_confirmacao"("cod_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "codigo_recuperacao_cod_usuario_key" ON "codigo_recuperacao"("cod_usuario");

-- AddForeignKey
ALTER TABLE "codigo_confirmacao" ADD CONSTRAINT "codigo_confirmacao_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codigo_recuperacao" ADD CONSTRAINT "codigo_recuperacao_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
