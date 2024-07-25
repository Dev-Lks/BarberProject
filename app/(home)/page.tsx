import Header from "../_components/header";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";
import { Button } from "../_components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header />
      <section className="w-full bg-background py-12 md:py-24 lg:py-32">
        <div className="container flex flex-col-reverse items-center gap-8 px-4 md:px-6 lg:flex-row lg:gap-16">
          <div className="flex flex-col items-start gap-4 lg:max-w-[480px]">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Experimente o Melhor Salão de Barbeiros da Cidade
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Nossos barbeiros habilidosos oferecem uma ampla gama de serviços,
              desde cortes de cabelo clássicos até estilos modernos. Agende seu
              horário hoje mesmo e descubra a diferença.
            </p>
            <Button>Reservar horário</Button>
          </div>
          <div className="w-full max-w-[500px] overflow-hidden rounded-xl">
            <img
              src="/placeholder.svg"
              width={500}
              height={500}
              alt="Salão de Barbeiros"
              className="aspect-square w-full object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
