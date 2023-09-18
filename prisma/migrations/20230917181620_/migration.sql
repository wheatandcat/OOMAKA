-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "userId" TEXT
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day" INTEGER NOT NULL,
    "emoji" VARCHAR(5) NOT NULL,
    "text" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Url_id_key" ON "Url"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_id_key" ON "Schedule"("id");

-- CreateIndex
CREATE INDEX "Schedule_urlId_date_day_idx" ON "Schedule"("urlId", "date", "day");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_urlId_fkey" FOREIGN KEY ("urlId") REFERENCES "Url"("id") ON DELETE CASCADE ON UPDATE CASCADE;
