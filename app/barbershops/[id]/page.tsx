import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershopinfo";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/_lib/auth";

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  };
}

const BarbershopDetailsPage = async ({
  params,
}: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);
  if (!params.id) {
    //to-do return to home page
    return null;
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      services: true,
    },
  });

  const ratings = await db.rating.findMany({
    where: {
      barbershopId: params.id,
    },
  });

  if (!barbershop) {
    //to-do return to home page
    return null;
  }

  return (
    <div>
      <BarbershopInfo ratings={ratings} barbershop={barbershop} />

      <div className="px-5 flex flex-col gap-4 py-6">
        {barbershop.services.map((service) => (
          <ServiceItem
            barbershop={barbershop}
            key={service.id}
            service={service}
            isAuthenticated={!!session?.user}
          />
        ))}
      </div>
    </div>
  );
};

export default BarbershopDetailsPage;
