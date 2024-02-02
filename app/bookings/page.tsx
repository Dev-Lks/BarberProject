import Header from "../_components/header";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";
import { isFuture, isPast } from "date-fns";

const BookingsDetailsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id,
    },
    include: {
      service: true,
      barbershop: true,
    },
  });

  const confirmedBookings = bookings.filter((booking) =>
    isFuture(booking.date)
  );
  const finishedmedBookings = bookings.filter((booking) =>
    isPast(booking.date)
  );

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="tex-sm text-bold">Agendamentos</h1>

        <h2 className="text-sm uppercase font-bold mb-3 mt-6 text-gray-400">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>

        <h2 className="text-sm uppercase font-bold mb-3 mt-6 text-gray-400">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedmedBookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
          ))}
        </div>
      </div>
    </>
  );
};

export default BookingsDetailsPage;
