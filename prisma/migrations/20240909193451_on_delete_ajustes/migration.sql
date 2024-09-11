-- DropForeignKey
ALTER TABLE "codigo_confirmacao" DROP CONSTRAINT "codigo_confirmacao_cod_usuario_fkey";

-- DropForeignKey
ALTER TABLE "codigo_recuperacao" DROP CONSTRAINT "codigo_recuperacao_cod_usuario_fkey";

-- DropForeignKey
ALTER TABLE "concessionaria" DROP CONSTRAINT "concessionaria_cod_criador_fkey";

-- DropForeignKey
ALTER TABLE "equipamento" DROP CONSTRAINT "equipamento_cod_unidade_consumidora_fkey";

-- DropForeignKey
ALTER TABLE "equipamento" DROP CONSTRAINT "equipamento_cod_usuario_cadastrou_fkey";

-- DropForeignKey
ALTER TABLE "intervalo_tarifa" DROP CONSTRAINT "intervalo_tarifa_cod_tarifa_fkey";

-- DropForeignKey
ALTER TABLE "unidade_consumidora" DROP CONSTRAINT "unidade_consumidora_cod_criador_fkey";

-- AlterTable
ALTER TABLE "concessionaria" ALTER COLUMN "cod_criador" DROP NOT NULL;

-- AlterTable
ALTER TABLE "equipamento" ALTER COLUMN "cod_usuario_cadastrou" DROP NOT NULL;

-- AlterTable
ALTER TABLE "unidade_consumidora" ALTER COLUMN "cod_criador" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "concessionaria" ADD CONSTRAINT "concessionaria_cod_criador_fkey" FOREIGN KEY ("cod_criador") REFERENCES "usuario"("cod_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervalo_tarifa" ADD CONSTRAINT "intervalo_tarifa_cod_tarifa_fkey" FOREIGN KEY ("cod_tarifa") REFERENCES "tarifa"("cod_tarifa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_usuario_cadastrou_fkey" FOREIGN KEY ("cod_usuario_cadastrou") REFERENCES "usuario"("cod_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_unidade_consumidora_fkey" FOREIGN KEY ("cod_unidade_consumidora") REFERENCES "unidade_consumidora"("cod_unidade_consumidora") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codigo_confirmacao" ADD CONSTRAINT "codigo_confirmacao_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codigo_recuperacao" ADD CONSTRAINT "codigo_recuperacao_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidade_consumidora" ADD CONSTRAINT "unidade_consumidora_cod_criador_fkey" FOREIGN KEY ("cod_criador") REFERENCES "usuario"("cod_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
