-- CreateTable
CREATE TABLE "RestaurantClosure" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locationId" INTEGER,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RestaurantClosure_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
