"use server";

import { revalidatePath } from "next/cache";

export const refreshBarbershop = async () => {
  revalidatePath("/barbershops/[id]");
};
