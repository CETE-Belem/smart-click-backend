/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Unidade_Consumidora` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unidade_Consumidora_numero_key" ON "Unidade_Consumidora"("numero");
