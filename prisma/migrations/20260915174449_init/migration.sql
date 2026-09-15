-- CreateEnum
CREATE TYPE "SpinCategory" AS ENUM ('money', 'cloth');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Daxu',
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spinNumber" INTEGER NOT NULL,
    "category" "SpinCategory" NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinalGift" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selectedResult" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinalGift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_sessionId_key" ON "User"("sessionId");

-- CreateIndex
CREATE INDEX "User_sessionId_idx" ON "User"("sessionId");

-- CreateIndex
CREATE INDEX "Spin_userId_idx" ON "Spin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Spin_userId_spinNumber_key" ON "Spin"("userId", "spinNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FinalGift_userId_key" ON "FinalGift"("userId");

-- CreateIndex
CREATE INDEX "FinalGift_userId_idx" ON "FinalGift"("userId");

-- AddForeignKey
ALTER TABLE "Spin" ADD CONSTRAINT "Spin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalGift" ADD CONSTRAINT "FinalGift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
