/*
  Warnings:

  - You are about to drop the column `energiaAparenteExportada` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `energiaAparenteImportada` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `energiaAtivaExportada` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `energiaAtivaImportada` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `energiaReativaExportada` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `energiaReativaImportada` on the `dados_sensor` table. All the data in the column will be lost.
  - You are about to drop the column `subgrupo` on the `equipamento` table. All the data in the column will be lost.
  - Added the required column `optanteTB` to the `unidade_consumidora` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgrupo` to the `unidade_consumidora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dados_sensor" DROP COLUMN "energiaAparenteExportada",
DROP COLUMN "energiaAparenteImportada",
DROP COLUMN "energiaAtivaExportada",
DROP COLUMN "energiaAtivaImportada",
DROP COLUMN "energiaReativaExportada",
DROP COLUMN "energiaReativaImportada",
ADD COLUMN     "potenciaAparenteA" DOUBLE PRECISION,
ADD COLUMN     "potenciaAparenteB" DOUBLE PRECISION,
ADD COLUMN     "potenciaAparenteC" DOUBLE PRECISION,
ADD COLUMN     "potenciaAtivaA" DOUBLE PRECISION,
ADD COLUMN     "potenciaAtivaB" DOUBLE PRECISION,
ADD COLUMN     "potenciaAtivaC" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "equipamento" DROP COLUMN "subgrupo";

-- AlterTable
ALTER TABLE "unidade_consumidora" ADD COLUMN     "optanteTB" BOOLEAN NOT NULL,
ADD COLUMN     "subgrupo" "Subgrupo" NOT NULL;
