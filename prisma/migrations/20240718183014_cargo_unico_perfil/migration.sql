/*
  Warnings:

  - A unique constraint covering the columns `[cargo]` on the table `perfil` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "perfil_cargo_key" ON "perfil"("cargo");
