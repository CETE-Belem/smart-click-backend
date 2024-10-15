-- DropForeignKey
ALTER TABLE "unidade_consumidora" DROP CONSTRAINT "unidade_consumidora_cod_concessionaria_fkey";

-- AddForeignKey
ALTER TABLE "unidade_consumidora" ADD CONSTRAINT "unidade_consumidora_cod_concessionaria_fkey" FOREIGN KEY ("cod_concessionaria") REFERENCES "concessionaria"("cod_concessionaria") ON DELETE CASCADE ON UPDATE CASCADE;
