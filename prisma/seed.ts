import "dotenv/config";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@restaurant.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash }
  });

  const locations = await Promise.all([
    prisma.location.upsert({
      where: { name: "Downtown Bistro" },
      update: {},
      create: { name: "Downtown Bistro", address: "12 Sunset Ave, Downtown" }
    }),
    prisma.location.upsert({
      where: { name: "Riverside Lounge" },
      update: {},
      create: { name: "Riverside Lounge", address: "404 Riverfront Rd" }
    })
  ]);

  const tableTypes = await Promise.all(
    [2, 4, 6, 8].map((pax) =>
      prisma.tableType.upsert({
        where: { paxSize: pax },
        update: {},
        create: { paxSize: pax, description: `${pax} guests` }
      })
    )
  );

  // Seed daily availability for today and next 7 days
  const today = dayjs().startOf("day");
  const fetchedLocations = await prisma.location.findMany({ where: { isActive: true } });
  const fetchedTableTypes = await prisma.tableType.findMany({ where: { isActive: true } });
  const defaultTimeSlots = ["18:00-19:00", "19:00-20:00", "20:00-21:00"];

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = today.add(dayOffset, "day").toDate();
    for (const location of fetchedLocations) {
      for (const slot of defaultTimeSlots) {
        for (const tableType of fetchedTableTypes) {
          await prisma.dailyAvailability.upsert({
            where: {
              locationId_date_timeSlot_tableTypeId: {
                locationId: location.id,
                date: date,
                timeSlot: slot,
                tableTypeId: tableType.id
              }
            },
            update: {
              totalTables: 4,
              availableTables: 4
            },
            create: {
              locationId: location.id,
              tableTypeId: tableType.id,
              date: date,
              timeSlot: slot,
              totalTables: 4,
              availableTables: 4
            }
          });
        }
      }
    }
  }

  // Seed time slots
  const timeSlots = ["18:00-19:00", "19:00-20:00", "20:00-21:00"];
  for (let i = 0; i < timeSlots.length; i++) {
    await prisma.timeSlot.upsert({
      where: { slot: timeSlots[i] },
      update: {},
      create: {
        slot: timeSlots[i],
        isActive: true,
        sortOrder: i
      }
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
