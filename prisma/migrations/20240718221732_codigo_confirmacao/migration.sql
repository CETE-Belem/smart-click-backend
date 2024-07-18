-- CreateTable
CREATE TABLE "Codigo_Confirmacao" (
    "cod_codigo" TEXT NOT NULL,
    "codigo" VARCHAR(6) NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "cod_usuario" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Codigo_Confirmacao_pkey" PRIMARY KEY ("cod_codigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Codigo_Confirmacao_codigo_key" ON "Codigo_Confirmacao"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Codigo_Confirmacao_cod_usuario_key" ON "Codigo_Confirmacao"("cod_usuario");

-- AddForeignKey
ALTER TABLE "Codigo_Confirmacao" ADD CONSTRAINT "Codigo_Confirmacao_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
