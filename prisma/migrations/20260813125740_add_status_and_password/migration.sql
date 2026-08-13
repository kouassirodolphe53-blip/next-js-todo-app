/*
  Warnings:

  - You are about to drop the column `isDone` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OFFEN', 'IN_ARBEIT', 'ERLEDIGT');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "isDone",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'OFFEN';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
