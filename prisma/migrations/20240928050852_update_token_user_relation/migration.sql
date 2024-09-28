/*
  Warnings:

  - A unique constraint covering the columns `[accessToken,wallet]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_accessToken_wallet_key" ON "Token"("accessToken", "wallet");
