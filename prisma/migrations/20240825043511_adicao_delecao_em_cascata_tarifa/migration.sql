-- DropForeignKey
ALTER TABLE "intervalo_tarifa" DROP CONSTRAINT "intervalo_tarifa_cod_tarifa_fkey";

-- AddForeignKey
ALTER TABLE "intervalo_tarifa" ADD CONSTRAINT "intervalo_tarifa_cod_tarifa_fkey" FOREIGN KEY ("cod_tarifa") REFERENCES "tarifa"("cod_tarifa") ON DELETE CASCADE ON UPDATE CASCADE;
