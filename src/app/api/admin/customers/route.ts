import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAdminFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        // Verify admin authentication
        const admin = getAdminFromRequest(req);
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "lastBooking";
        const sortOrder = searchParams.get("sortOrder") || "desc";

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
            bookings: any[];
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
                    bookings: [],
                    totalBookings: 0,
                    upcomingBookings: 0,
                    completedBookings: 0,
                    cancelledBookings: 0,
                    firstBookingDate: reservation.date,
                    lastBookingDate: reservation.date,
                });
            }

            const customer = customerMap.get(phone)!;
            customer.bookings.push(reservation);
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

        // Convert map to array
        let customers = Array.from(customerMap.values());

        // Apply search filter
        if (search) {
            const searchLower = search.toLowerCase();
            customers = customers.filter(
                (c) =>
                    c.customerName.toLowerCase().includes(searchLower) ||
                    c.customerPhone.includes(searchLower) ||
                    (c.customerEmail && c.customerEmail.toLowerCase().includes(searchLower))
            );
        }

        // Apply sorting
        customers.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case "name":
                    comparison = a.customerName.localeCompare(b.customerName);
                    break;
                case "totalBookings":
                    comparison = a.totalBookings - b.totalBookings;
                    break;
                case "lastBooking":
                    comparison = a.lastBookingDate.getTime() - b.lastBookingDate.getTime();
                    break;
                case "firstBooking":
                    comparison = a.firstBookingDate.getTime() - b.firstBookingDate.getTime();
                    break;
                default:
                    comparison = a.lastBookingDate.getTime() - b.lastBookingDate.getTime();
            }

            return sortOrder === "asc" ? comparison : -comparison;
        });

        // Remove the full bookings array from response (only needed for aggregation)
        const customersResponse = customers.map(({ bookings, ...customer }) => customer);

        return NextResponse.json({
            customers: customersResponse,
            totalCustomers: customers.length,
            activeCustomers: customers.filter(c => c.upcomingBookings > 0).length,
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json(
            { message: "Failed to fetch customers" },
            { status: 500 }
        );
    }
}
