-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('ADMIN', 'USUARIO');

-- CreateTable
CREATE TABLE "perfil" (
    "cod_perfil" TEXT NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "cargo" "Cargo" NOT NULL DEFAULT 'USUARIO',

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("cod_perfil")
);

-- CreateTable
CREATE TABLE "usuario" (
    "cod_usuario" TEXT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" TEXT NOT NULL,
    "senhaSalt" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "cod_perfil" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("cod_usuario")
);

-- CreateTable
CREATE TABLE "concessionaria" (
    "cod_concessionaria" TEXT NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,

    CONSTRAINT "concessionaria_pkey" PRIMARY KEY ("cod_concessionaria")
);

-- CreateTable
CREATE TABLE "tarifa" (
    "cod_tarifa" TEXT NOT NULL,
    "dt_tarifa" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "cod_concessionaria" TEXT NOT NULL,

    CONSTRAINT "tarifa_pkey" PRIMARY KEY ("cod_tarifa")
);

-- CreateTable
CREATE TABLE "equipamento" (
    "cod_equipamento" TEXT NOT NULL,
    "mac" VARCHAR(17) NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "descricao" VARCHAR(255),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "cod_usuario" TEXT NOT NULL,
    "cod_concessionaria" TEXT NOT NULL,

    CONSTRAINT "equipamento_pkey" PRIMARY KEY ("cod_equipamento")
);

-- CreateTable
CREATE TABLE "dados_sensor" (
    "id" TEXT NOT NULL,
    "iA" DOUBLE PRECISION,
    "iB" DOUBLE PRECISION,
    "iC" DOUBLE PRECISION,
    "vA" DOUBLE PRECISION,
    "vB" DOUBLE PRECISION,
    "vC" DOUBLE PRECISION,
    "FPA" DOUBLE PRECISION,
    "FPB" DOUBLE PRECISION,
    "FPC" DOUBLE PRECISION,
    "energiaAtivaExportada" DOUBLE PRECISION,
    "energiaAtivaImportada" DOUBLE PRECISION,
    "energiaReativaExportada" DOUBLE PRECISION,
    "energiaReativaImportada" DOUBLE PRECISION,
    "energiaAparenteExportada" DOUBLE PRECISION,
    "energiaAparenteImportada" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "cod_equipamento" TEXT NOT NULL,

    CONSTRAINT "dados_sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "equipamento_cod_equipamento_key" ON "equipamento"("cod_equipamento");

-- CreateIndex
CREATE UNIQUE INDEX "equipamento_mac_key" ON "equipamento"("mac");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_cod_perfil_fkey" FOREIGN KEY ("cod_perfil") REFERENCES "perfil"("cod_perfil") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifa" ADD CONSTRAINT "tarifa_cod_concessionaria_fkey" FOREIGN KEY ("cod_concessionaria") REFERENCES "concessionaria"("cod_concessionaria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "usuario"("cod_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipamento" ADD CONSTRAINT "equipamento_cod_concessionaria_fkey" FOREIGN KEY ("cod_concessionaria") REFERENCES "concessionaria"("cod_concessionaria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dados_sensor" ADD CONSTRAINT "dados_sensor_cod_equipamento_fkey" FOREIGN KEY ("cod_equipamento") REFERENCES "equipamento"("cod_equipamento") ON DELETE CASCADE ON UPDATE CASCADE;
