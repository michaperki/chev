-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "wallet" TEXT,
    "lichessId" TEXT,
    "lichessUsername" TEXT,
    "lichessAccessToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "lichessAccessToken", "lichessId", "lichessUsername", "updatedAt", "wallet") SELECT "createdAt", "id", "lichessAccessToken", "lichessId", "lichessUsername", "updatedAt", "wallet" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_lichessId_key" ON "User"("lichessId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
