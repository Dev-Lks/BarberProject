import { db } from "@/app/_lib/prisma";

interface SaveRatingParams {
  value: number;
  userId: string;
  barbershopId: string;
}

export const saveRating = async (params: SaveRatingParams) => {
  await db.rating.create({
    data: {
      value: params.value,
      userId: params.userId,
      barbershopId: params.barbershopId,
    },
  });
};
