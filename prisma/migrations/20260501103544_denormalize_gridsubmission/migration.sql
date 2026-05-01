/*
  Warnings:

  - A unique constraint covering the columns `[userId,gridNumber]` on the table `GridSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gridDate` to the `GridSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gridNumber` to the `GridSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GridSubmission" DROP CONSTRAINT "GridSubmission_gridId_fkey";

-- DropIndex
DROP INDEX "GridSubmission_userId_gridId_key";

-- AlterTable: add with defaults first (backfill from Grid), then tighten
ALTER TABLE "GridSubmission" ADD COLUMN "gridDate" TIMESTAMP(3),
ADD COLUMN "gridNumber" INTEGER,
ALTER COLUMN "gridId" DROP NOT NULL;

-- Backfill from the related Grid row
UPDATE "GridSubmission" gs
SET "gridNumber" = g."gridNumber",
    "gridDate"   = g."date"
FROM "Grid" g
WHERE g."id" = gs."gridId";

-- Now make them NOT NULL
ALTER TABLE "GridSubmission" ALTER COLUMN "gridDate" SET NOT NULL;
ALTER TABLE "GridSubmission" ALTER COLUMN "gridNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GridSubmission_userId_gridNumber_key" ON "GridSubmission"("userId", "gridNumber");

-- AddForeignKey
ALTER TABLE "GridSubmission" ADD CONSTRAINT "GridSubmission_gridId_fkey" FOREIGN KEY ("gridId") REFERENCES "Grid"("id") ON DELETE SET NULL ON UPDATE CASCADE;
