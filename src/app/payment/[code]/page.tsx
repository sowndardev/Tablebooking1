import Link from "next/link";

type Reservation = {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  requestedPax: number;
  timeSlot: string;
  status: string;
  paymentStatus: string;
  location: { name: string; address: string };
  date: string;
};

import { getBaseUrl } from "@/lib/base-url";
import PaymentActions from "./payment-actions";

async function getReservation(code: string): Promise<Reservation | null> {
  const res = await fetch(`${getBaseUrl()}/api/reservations/${code}`, {
    cache: "no-store"
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function PaymentPage({ params }: { params: { code: string } }) {
  const reservation = await getReservation(params.code);
  if (!reservation) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow">
        <p className="text-lg text-red-600">Reservation not found.</p>
        <Link href="/book" className="mt-4 inline-block text-primary underline">
          Start a new booking
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Step 2 of 3</p>
        <h1 className="text-3xl font-semibold text-primary">Payment</h1>
        <p className="text-slate-600">Confirm your booking in one click.</p>
      </header>
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-slate-500">Booking code</p>
            <p className="text-2xl font-semibold">{reservation.bookingCode}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Guest</p>
            <p className="text-lg font-medium">{reservation.customerName}</p>
            <p className="text-sm text-slate-500">{reservation.customerPhone}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Venue</p>
            <p className="text-lg font-medium">{reservation.location.name}</p>
            <p className="text-sm text-slate-500">{reservation.location.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Schedule</p>
            <p className="text-lg font-medium">
              {reservation.date.slice(0, 10)} at {reservation.timeSlot}
            </p>
            <p className="text-sm text-slate-500">{reservation.requestedPax} guests</p>
          </div>
        </div>
        <PaymentActions bookingCode={reservation.bookingCode} />
      </div>
    </div>
  );
}

