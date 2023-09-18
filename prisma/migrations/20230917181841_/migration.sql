-- DropIndex
DROP INDEX "Schedule_id_key";

-- AlterTable
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id");
