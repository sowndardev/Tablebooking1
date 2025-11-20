type BookingPayload = {
  bookingCode: string;
  status: string;
  paymentStatus: string;
};

export async function notifyTodook(payload: BookingPayload) {
  if (!process.env.TODDOK_WEBHOOK_URL) {
    console.log("Webhook payload (stub)", payload);
    return;
  }
  try {
    await fetch(process.env.TODDOK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Failed to notify Todook", error);
  }
}

