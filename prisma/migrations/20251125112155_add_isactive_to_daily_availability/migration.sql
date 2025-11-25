-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DailyAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locationId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "tableTypeId" INTEGER NOT NULL,
    "totalTables" INTEGER NOT NULL,
    "availableTables" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyAvailability_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DailyAvailability_tableTypeId_fkey" FOREIGN KEY ("tableTypeId") REFERENCES "TableType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DailyAvailability" ("availableTables", "createdAt", "date", "id", "locationId", "tableTypeId", "timeSlot", "totalTables", "updatedAt") SELECT "availableTables", "createdAt", "date", "id", "locationId", "tableTypeId", "timeSlot", "totalTables", "updatedAt" FROM "DailyAvailability";
DROP TABLE "DailyAvailability";
ALTER TABLE "new_DailyAvailability" RENAME TO "DailyAvailability";
CREATE UNIQUE INDEX "DailyAvailability_locationId_date_timeSlot_tableTypeId_key" ON "DailyAvailability"("locationId", "date", "timeSlot", "tableTypeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
