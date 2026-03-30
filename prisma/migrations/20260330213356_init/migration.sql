/*
  Warnings:

  - You are about to drop the column `genero` on the `Filme` table. All the data in the column will be lost.
  - Added the required column `classificacaoEtaria` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generoId` to the `Filme` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Ingresso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorPago` to the `Ingresso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `descricao` to the `LancheCombo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filme" DROP COLUMN "genero",
ADD COLUMN     "classificacaoEtaria" TEXT NOT NULL,
ADD COLUMN     "generoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ingresso" ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "valorPago" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "LancheCombo" ADD COLUMN     "descricao" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Genero" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Genero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genero_nome_key" ON "Genero"("nome");

-- AddForeignKey
ALTER TABLE "Filme" ADD CONSTRAINT "Filme_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
