import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-12 py-10">
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-primary tracking-tight">
          Table Booking Hub
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Seamlessly manage restaurant reservations. Connect with customers from WhatsApp, handle walk-ins, and optimize your daily capacity.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl">
              📅
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Make a Reservation</h2>
            <p className="text-slate-600">
              Book a table for yourself or your group. Choose your preferred location, date, and time slot instantly.
            </p>
            <div className="pt-4">
              <a
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform group-hover:translate-x-1"
              >
                Book Now &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-md border border-slate-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl">
              🔍
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Booking</h2>
            <p className="text-slate-600">
              Already have a reservation? Look up your booking details, check status, or cancel if plans change.
            </p>
            <div className="pt-4">
              <a
                href="/manage-booking"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary"
              >
                Find Booking
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="text-center pt-8 border-t border-slate-100">
        <p className="text-slate-500 mb-4">Administrator access</p>
        <a
          href="/admin/login"
          className="text-sm font-medium text-slate-400 hover:text-primary transition-colors"
        >
          Log in to Admin Dashboard
        </a>
      </section>
    </main>
  );
}

