"use server";

import { revalidatePath } from "next/cache";

export const refreshBookings = async () => {
  revalidatePath("/bookings");
};
