import { z } from "zod";

export const createReservationSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email().optional().or(z.literal("")),
  locationId: z.number().int().positive(),
  date: z.string(), // ISO
  timeSlot: z.string().min(3),
  requestedPax: z.number().int().positive(),
  source: z.enum(["WHATSAPP", "OFFLINE", "PHONE_CALL"]).default("WHATSAPP")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const availabilitySchema = z.object({
  locationId: z.number().int(),
  date: z.string(),
  timeSlot: z.string(),
  tableTypeId: z.number().int(),
  totalTables: z.number().int().nonnegative()
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

