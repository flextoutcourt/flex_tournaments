-- CreateTable
CREATE TABLE "YoutubeSearchCache" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeSearchCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "YoutubeSearchCache_query_idx" ON "YoutubeSearchCache"("query");

-- CreateIndex
CREATE INDEX "YoutubeSearchCache_expiresAt_idx" ON "YoutubeSearchCache"("expiresAt");
