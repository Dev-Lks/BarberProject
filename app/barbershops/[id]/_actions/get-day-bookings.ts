"use server";

import { db } from "@/app/_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

<<<<<<< HEAD
export const getDayBookingss = async (barbershopId: string, date: Date) => {
  const bookings = await db.booking.findMany({
    where: {
      barbershopId,
=======
export const getDayBookingss = async (date: Date) => {
  const bookings = await db.booking.findMany({
    where: {
>>>>>>> 35220b98e1b8f0ca4629660db55599ab5026798c
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });

  return bookings;
};
