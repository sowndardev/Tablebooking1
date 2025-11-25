import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAdminFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // Verify admin authentication
        const admin = getAdminFromRequest(req);
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Fetch all reservations
        const reservations = await prisma.reservation.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                location: true,
                tableType: true,
            },
        });

        // Group reservations by customer phone
        const customerMap = new Map<string, {
            customerName: string;
            customerPhone: string;
            customerEmail: string | null;
            totalBookings: number;
            upcomingBookings: number;
            completedBookings: number;
            cancelledBookings: number;
            firstBookingDate: Date;
            lastBookingDate: Date;
        }>();

        const now = new Date();

        reservations.forEach((reservation) => {
            const phone = reservation.customerPhone;

            if (!customerMap.has(phone)) {
                customerMap.set(phone, {
                    customerName: reservation.customerName,
                    customerPhone: phone,
                    customerEmail: reservation.customerEmail,
                    totalBookings: 0,
                    upcomingBookings: 0,
                    completedBookings: 0,
                    cancelledBookings: 0,
                    firstBookingDate: reservation.date,
                    lastBookingDate: reservation.date,
                });
            }

            const customer = customerMap.get(phone)!;
            customer.totalBookings++;

            // Update name and email to most recent
            if (reservation.createdAt > customer.lastBookingDate) {
                customer.customerName = reservation.customerName;
                customer.customerEmail = reservation.customerEmail || customer.customerEmail;
            }

            // Count booking types
            if (reservation.status === "CANCELLED") {
                customer.cancelledBookings++;
            } else if (reservation.date > now) {
                customer.upcomingBookings++;
            } else {
                customer.completedBookings++;
            }

            // Update first and last booking dates
            if (reservation.date < customer.firstBookingDate) {
                customer.firstBookingDate = reservation.date;
            }
            if (reservation.date > customer.lastBookingDate) {
                customer.lastBookingDate = reservation.date;
            }
        });

        // Convert map to array and sort by name
        const customers = Array.from(customerMap.values()).sort((a, b) =>
            a.customerName.localeCompare(b.customerName)
        );

        // Generate CSV content
        const csvRows: string[] = [];

        // Header row
        csvRows.push(
            "Customer Name,Phone,Email,Total Bookings,Upcoming Bookings,Completed Bookings,Cancelled Bookings,First Booking,Last Booking"
        );

        // Data rows
        customers.forEach((customer) => {
            const row = [
                escapeCSV(customer.customerName),
                escapeCSV(customer.customerPhone),
                escapeCSV(customer.customerEmail || ""),
                customer.totalBookings.toString(),
                customer.upcomingBookings.toString(),
                customer.completedBookings.toString(),
                customer.cancelledBookings.toString(),
                formatDate(customer.firstBookingDate),
                formatDate(customer.lastBookingDate),
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = csvRows.join("\n");

        // Return CSV file
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().split("T")[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("Error exporting customers:", error);
        return NextResponse.json(
            { message: "Failed to export customers" },
            { status: 500 }
        );
    }
}

// Helper function to escape CSV fields
function escapeCSV(field: string): string {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}

// Helper function to format date
function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}
