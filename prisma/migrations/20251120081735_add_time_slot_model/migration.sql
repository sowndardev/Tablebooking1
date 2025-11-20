-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slot" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_slot_key" ON "TimeSlot"("slot");
