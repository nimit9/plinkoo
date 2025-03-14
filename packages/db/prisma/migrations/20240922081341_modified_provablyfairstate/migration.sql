/*
  Warnings:

  - You are about to drop the column `gameId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `ProvablyFairState` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `ProvablyFairState` table. All the data in the column will be lost.
  - Added the required column `betAmount` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientSeed` to the `ProvablyFairState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serverSeed` to the `ProvablyFairState` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProvablyFairState" DROP CONSTRAINT "ProvablyFairState_gameId_fkey";

-- DropIndex
DROP INDEX "Game_gameId_key";

-- DropIndex
DROP INDEX "Game_userId_key";

-- DropIndex
DROP INDEX "ProvablyFairState_gameId_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "gameId",
ADD COLUMN     "betAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProvablyFairState" DROP COLUMN "gameId",
DROP COLUMN "state",
ADD COLUMN     "clientSeed" TEXT NOT NULL,
ADD COLUMN     "nonce" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "serverSeed" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL DEFAULT 0;
