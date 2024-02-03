import BarbershopItem from "../(home)/_components/barbershop-item";
import Search from "../(home)/_components/search";
import Header from "../_components/header";
import { db } from "../_lib/prisma";

interface barberShopProps {
  searchParams: {
    search?: string;
  };
}

const SearchPage = async ({ searchParams }: barberShopProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });
  return (
    <>
      <div>
        <Header />

        <div className="px-5 mt-6">
          <Search  />
        </div>

        <div className="pt-3 px-5">
          <h2 className="uppercase text-gray-400 text-bold">
            RESULTADOS PARA &ldquo;{searchParams.search}&ldquo;
          </h2>
          <div className="flex flex-col gap-3 mt-6">
            {barbershops.map((barbershop) => (
              <BarbershopItem barbershop={barbershop} key={barbershop.id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
