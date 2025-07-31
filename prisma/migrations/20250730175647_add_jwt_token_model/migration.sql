-- CreateTable
CREATE TABLE "JwtToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3),

    CONSTRAINT "JwtToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JwtToken_token_key" ON "JwtToken"("token");

-- CreateIndex
CREATE INDEX "JwtToken_userId_idx" ON "JwtToken"("userId");

-- CreateIndex
CREATE INDEX "JwtToken_expiresAt_idx" ON "JwtToken"("expiresAt");

-- CreateIndex
CREATE INDEX "JwtToken_isRevoked_idx" ON "JwtToken"("isRevoked");

-- AddForeignKey
ALTER TABLE "JwtToken" ADD CONSTRAINT "JwtToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
