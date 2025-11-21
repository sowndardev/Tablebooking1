import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const location = await prisma.location.findFirst();
    const timeSlot = await prisma.timeSlot.findFirst();
    const tableType = await prisma.tableType.findFirst();

    console.log("Location ID:", location?.id);
    console.log("Time Slot:", timeSlot?.slot);
    console.log("Table Type PAX:", tableType?.paxSize);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
