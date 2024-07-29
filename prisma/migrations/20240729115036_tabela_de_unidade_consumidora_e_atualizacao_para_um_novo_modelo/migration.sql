/*
  Warnings:

  - You are about to drop the column `date` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `cod_perfil` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `perfil` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `data` to the `dados_sensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cod_unidade_consumidora` to the `equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgrupo` to the `equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tensao_nominal` to the `equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `equipamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgrupo` to the `tarifa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tipo_Tarifa" AS ENUM ('BRANCA', 'CONSTANTE');

-- DropForeignKey
ALTER TABLE "usuario" DROP CONSTRAINT "usuario_cod_perfil_fkey";

-- AlterTable
ALTER TABLE "dados_sensor" DROP COLUMN "date",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "equipamento" ADD COLUMN     "cidade" VARCHAR(255) NOT NULL,
ADD COLUMN     "cod_unidade_consumidora" TEXT NOT NULL,
ADD COLUMN     "subgrupo" VARCHAR(255) NOT NULL,
ADD COLUMN     "tensao_nominal" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "uf" VARCHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE "tarifa" ADD COLUMN     "subgrupo" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "cod_perfil",
ADD COLUMN     "perfil" "Cargo" NOT NULL;

-- DropTable
DROP TABLE "perfil";

-- CreateTable
CREATE TABLE "intervalo_tarifa" (
    "cod_intervalo_tarifa" TEXT NOT NULL,
    "de" INTEGER NOT NULL,
    "ate" INTEGER NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "tipo" "Tipo_Tarifa" NOT NULL,
    "cod_tarifa" TEXT NOT NULL,

    CONSTRAINT "intervalo_tarifa_pkey" PRIMARY KEY ("cod_intervalo_tarifa")
);

-- CreateTable
CREATE TABLE "Unidade_Consumidora" (
    "cod_unidade_consumidora" TEXT NOT NULL,
    "cidade" VARCHAR(200) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "cod_concessionaria" TEXT NOT NULL,
    "cod_usuario" TEXT NOT NULL,

    CONSTRAINT "Unidade_Consumidora_pkey" PRIMARY KEY ("cod_unidade_consumidora")
);

-- AddForeignKey
ALTER TABLE "intervalo_tarifa" ADD CONSTRAINT "intervalo_tarifa_cod_tarifa_fkey" FOREIGN KEY ("cod_tarifa") REFERENCES "tarifa"("cod_tarifa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_unidade_consumidora_fkey" FOREIGN KEY ("cod_unidade_consumidora") REFERENCES "Unidade_Consumidora"("cod_unidade_consumidora") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidade_Consumidora" ADD CONSTRAINT "Unidade_Consumidora_cod_concessionaria_fkey" FOREIGN KEY ("cod_concessionaria") REFERENCES "concessionaria"("cod_concessionaria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidade_Consumidora" ADD CONSTRAINT "Unidade_Consumidora_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
