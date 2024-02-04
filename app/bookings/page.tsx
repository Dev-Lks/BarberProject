import Header from "../_components/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";

const BookingsDetailsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),

    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ]);

  const numConfirmedBookings = confirmedBookings.length;
  const numfinishedBookings = finishedBookings.length;

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="tex-sm text-bold">Agendamentos</h1>

        {numConfirmedBookings >= 1 && (
          <div>
            <h2 className="text-sm uppercase font-bold mb-3 mt-6 text-gray-400">
              Confirmados
            </h2>

            <div className="flex flex-col gap-3">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}

        {numfinishedBookings >= 1 && (
          <div>
            <h2 className="text-sm uppercase font-bold mb-3 mt-6 text-gray-400">
              Finalizados
            </h2>
            <div className="flex flex-col gap-3">
              {finishedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </div>
        )}
      </div>

      {numConfirmedBookings <= 0 && numfinishedBookings <= 0 && (
        <h1>Você ainda não possui nenhum agendamento</h1>
      )}
    </>
  );
};

export default BookingsDetailsPage;
