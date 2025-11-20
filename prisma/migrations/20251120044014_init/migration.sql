-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TableType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paxSize" INTEGER NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locationId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "tableTypeId" INTEGER NOT NULL,
    "totalTables" INTEGER NOT NULL,
    "availableTables" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyAvailability_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DailyAvailability_tableTypeId_fkey" FOREIGN KEY ("tableTypeId") REFERENCES "TableType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookingCode" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "locationId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "requestedPax" INTEGER NOT NULL,
    "allocatedTableTypeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "paymentReference" TEXT,
    "source" TEXT NOT NULL DEFAULT 'WHATSAPP',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "availabilityId" INTEGER,
    CONSTRAINT "Reservation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_allocatedTableTypeId_fkey" FOREIGN KEY ("allocatedTableTypeId") REFERENCES "TableType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "DailyAvailability" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TableType_paxSize_key" ON "TableType"("paxSize");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAvailability_locationId_date_timeSlot_tableTypeId_key" ON "DailyAvailability"("locationId", "date", "timeSlot", "tableTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_bookingCode_key" ON "Reservation"("bookingCode");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
