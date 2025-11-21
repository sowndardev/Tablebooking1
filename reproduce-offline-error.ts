import "dotenv/config";


async function main() {
    // 1. Login
    const loginRes = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: "admin@restaurant.local",
            password: "ChangeMe123!"
        })
    });

    if (!loginRes.ok) {
        console.error("Login failed:", await loginRes.text());
        return;
    }

    const cookie = loginRes.headers.get("set-cookie");
    console.log("Logged in, cookie:", cookie);

    // 2. Create Offline Booking
    const bookingRes = await fetch("http://localhost:3001/api/admin/reservations/offline", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Cookie": cookie || ""
        },
        body: JSON.stringify({
            customerName: "Test User",
            customerPhone: "1234567890",
            locationId: 1,
            date: new Date().toISOString().slice(0, 10),
            timeSlot: "18:00-19:00",
            requestedPax: 2,
            paymentStatus: "PAID"
        })
    });

    console.log("Status:", bookingRes.status);
    const text = await bookingRes.text();
    console.log("Response:", text);
}

main().catch(console.error);
