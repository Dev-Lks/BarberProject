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

        <div className="px-5 py-6 flex flex-col gap-6">
          <Search />

          <div className="pt-3 px-5 ">
            <h2 className="uppercase text-gray-400 font-bold">
              RESULTADOS PARA &ldquo;{searchParams.search}&ldquo;
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {barbershops.map((barbershop) => (
                <div className="w-full" key={barbershop.id}>
                  <BarbershopItem barbershop={barbershop} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
