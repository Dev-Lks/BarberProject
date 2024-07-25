import Header from "../_components/header";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";
import { Button } from "../_components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header />
      <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden">
        <img
          src=""
          alt="Barbershop Interior"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center space-y-6 max-w-2xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl  sm:text-4xl md:text-5xl font bold text-white ">
              {session?.user ? session?.user?.name : <>Seja bem vindo!</>}
            </h1>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
              Barbearia Lucao
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
              Barbearia malada Pocas ideia Vergonha pra midia, 244 nao é crime
            </p>
            <Button>Marcar Horário</Button>
          </div>
        </div>
      </section>
    </>
  );
}
