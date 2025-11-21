import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@restaurant.local";
    const password = "ChangeMe123!";

    console.log(`Checking for user: ${email}`);
    const user = await prisma.adminUser.findUnique({ where: { email } });

    if (!user) {
        console.error("❌ User not found in database!");
        return;
    }

    console.log("✅ User found.");
    console.log("Verifying password...");

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (isValid) {
        console.log("✅ Password matches hash.");
    } else {
        console.error("❌ Password does NOT match hash.");
        console.log("Hash in DB:", user.passwordHash);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
