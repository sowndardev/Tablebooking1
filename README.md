# Restaurant Table Reservation System

Production-ready WhatsApp-enabled reservation platform built with Next.js 14, Prisma, and SQLite. Includes:

- Customer booking journey (WhatsApp deeplink) with real-time capacity checks
- Mock payment step with success/failure flows and confirmation screen
- Customer self-service cancellation via booking code + phone
- Admin console (login protected) for locations, table sizes, daily availability, offline bookings, reservation monitoring
- REST APIs and webhook stubs for Todook integration

## Tech Stack

- Next.js 14 App Router (React + TypeScript)
- Prisma ORM with SQLite (swap to Postgres by updating `DATABASE_URL`)
- Tailwind CSS for UI
- JWT-based admin session stored in HTTP-only cookie
- Zod validation, SWR-style fetch hooks

## Getting Started

```bash
npm install
cp .env.example .env            # adjust secrets + database path
npm run prisma:generate
npx prisma migrate dev          # create schema
npm run seed                    # load defaults (admin, locations, availability)
npm run dev
```

Key env vars:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | SQLite/Postgres connection string |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |
| `ADMIN_SECRET_KEY` | Backup master passphrase |
| `JWT_SECRET` | Used to sign admin sessions |
| `TODDOK_WEBHOOK_URL` | Optional outbound webhook endpoint |

## Feature Map

- `/book` – public booking flow; query params (`name`, `phone`) auto-fill
- `/payment/[bookingCode]` – mock gateway with Pay/Fail buttons
- `/status/[bookingCode]` – final confirmation state
- `/manage-booking` – customer lookup + cancel
- `/admin/login` – secure access
- `/admin` – reservations dashboard
- `/admin/offline-booking` – walk-in capture
- `/admin/locations`, `/admin/table-types`, `/admin/availability` – masters & capacity

## API Surface (REST)

### Public
- `GET /api/public/locations` – active venues
- `GET /api/public/table-types` – PAX options
- `GET /api/public/availability?locationId&date&requestedPax` – slot inventory
- `POST /api/reservations` – create pending booking (returns payment URL)
- `GET /api/reservations/:booking_code` – booking status
- `POST /api/public/manage/lookup` – verify booking via code + phone
- `POST /api/public/manage/cancel` – customer cancellation

### Payment Simulation
- `POST /api/payments/:booking_code` with `{ "action": "success" | "failure" }`

### Admin (JWT cookie required)
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST /api/admin/locations`, `PUT/DELETE /api/admin/locations/:id`
- `GET/POST /api/admin/table-types`, `PUT/DELETE /api/admin/table-types/:id`
- `GET/POST /api/admin/daily-availability`, `PATCH /api/admin/daily-availability/:id`
- `GET /api/admin/reservations`, `PATCH /api/admin/reservations/:id`
- `POST /api/admin/reservations/offline` – walk-in booking

### Webhooks
- `POST /api/webhooks/todook/booking-status` – stub handler; `notifyTodook` helper will POST to `TODDOK_WEBHOOK_URL` whenever a reservation becomes `CONFIRMED` or `CANCELLED`.

## Inventory Logic

- `allocateTableOrThrow` chooses the smallest table type where `paxSize >= requestedPax` and `availableTables > 0`, scoped by location/date/slot.
- Availability rows are `upsert`ed and include `totalTables` plus `availableTables`. All booking flows adjust `availableTables` inside transactions to prevent overselling.
- Reservation status transitions:
  - Public booking: `PENDING_PAYMENT` + `UNPAID`
  - Payment success: `CONFIRMED` + `PAID` (inventory retained)
  - Payment failure or cancellation: status updated and inventory released (`availableTables++`)

## Usage Walkthrough

1. Seed database (`npm run seed`) – default admin user is from `.env`.
2. Open `http://localhost:3000/book` with optional query params `?name=John&phone=9198xxxx`.
3. Customer selects location/date/PAX; only slots with inventory appear.
4. Submission holds inventory and redirects to `/payment/<code>`.
5. Click **Pay now** to confirm → `/status/<code>` shows confirmation details.
6. Admin console:
   - Visit `/admin/login`, sign in, then use nav links for locations, table master, availability, reservations, or offline bookings.
7. Customer self-service: `/manage-booking` to cancel; inventory reopens instantly.

## Extending

- Replace SQLite with Postgres: update `DATABASE_URL`, rerun migrations.
- Integrate real PSP by swapping the mock payment page + `/api/payments` handler.
- Enhance admin UI (e.g., editable reservations) using the provided PATCH endpoints.
- Update `notifyTodook` to make authenticated calls to Todook when statuses change.

