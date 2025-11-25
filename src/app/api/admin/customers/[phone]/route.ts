import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAdminFromRequest } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(
    req: NextRequest,
    { params }: { params: { phone: string } }
) {
    try {
        // Verify admin authentication
        const admin = getAdminFromRequest(req);
        if (!admin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const phone = decodeURIComponent(params.phone);

        // Fetch all reservations for this customer
        const reservations = await prisma.reservation.findMany({
            where: {
                customerPhone: phone,
            },
            orderBy: {
                date: "desc",
            },
            include: {
                location: true,
                tableType: true,
            },
        });

        if (reservations.length === 0) {
            return NextResponse.json(
                { message: "Customer not found" },
                { status: 404 }
            );
        }

        // Get customer info from most recent reservation
        const latestReservation = reservations[0];
        const customerInfo = {
            customerName: latestReservation.customerName,
            customerPhone: phone,
            customerEmail: latestReservation.customerEmail,
        };

        // Calculate statistics
        const now = new Date();
        const stats = {
            totalBookings: reservations.length,
            upcomingBookings: reservations.filter(
                (r) => r.date > now && r.status !== "CANCELLED"
            ).length,
            completedBookings: reservations.filter(
                (r) => r.date <= now && r.status !== "CANCELLED"
            ).length,
            cancelledBookings: reservations.filter((r) => r.status === "CANCELLED")
                .length,
            firstBookingDate: reservations[reservations.length - 1].date,
            lastBookingDate: reservations[0].date,
        };

        // Format reservations for response
        const formattedReservations = reservations.map((r) => ({
            id: r.id,
            bookingCode: r.bookingCode,
            date: r.date,
            timeSlot: r.timeSlot,
            requestedPax: r.requestedPax,
            status: r.status,
            paymentStatus: r.paymentStatus,
            source: r.source,
            notes: r.notes,
            locationName: r.location.name,
            tableTypePax: r.tableType.paxSize,
            createdAt: r.createdAt,
        }));

        return NextResponse.json({
            customer: customerInfo,
            stats,
            reservations: formattedReservations,
        });
    } catch (error) {
        console.error("Error fetching customer details:", error);
        return NextResponse.json(
            { message: "Failed to fetch customer details" },
            { status: 500 }
        );
    }
}
