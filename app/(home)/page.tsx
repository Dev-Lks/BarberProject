import Header from "../_components/header";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import BarbershopItem from "./_components/barbershop-item";
import { db } from "../_lib/prisma";

import { authOptions } from "@/app/utils/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, recomendedbarbershops, confirmedBookings] =
    await Promise.all([
      db.barbershop.findMany({}),
      db.barbershop.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      session?.user
        ? await db.booking.findMany({
            where: {
              userId: session.user.id,
              date: {
                gte: new Date(),
              },
            },
            include: {
              service: true,
              barbershop: true,
            },
          })
        : Promise.resolve([]),
    ]);

  return (
    <div>
      <Header />

      <div className="px-5 pt-5 ">
        {session?.user ? (
          <h2 className="text-xl font-bold">
            Olá, {session?.user?.name?.split(" ")[0]}!
          </h2>
        ) : (
          <h2 className="text-xl font-bold">Olá. Faça seu Login!</h2>
        )}
        <p className="capitalize text-sm">
          {format(new Date(), "EEEE',' dd 'De' MMMM", {
            locale: ptBR,
          })}
        </p>
      </div>

      <div className="flex flex-col">
        <div className="px-5 mt-6 lg:w-[35%]">
          <Search />
        </div>

        <div className="lg:max-w-[35%] lg:w-[35%]  ">
          {confirmedBookings.length >= 1 && (
            <div className=" pt-3">
              <h2 className="text-xs pl-5 uppercase text-gray-400 font-bold mb-3">
                Agendamentos
              </h2>
              <div className="flex px-5 overflow-x-auto gap-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] lg:gap-5">
                {confirmedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className=" px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Recomendados
        </h2>

        <div className=" flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-[4.5rem]">
        <h2 className=" px-5 text-xs uppercase text-gray-400 font-bold mb-3">
          Populares
        </h2>

        <div className=" flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {recomendedbarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
