"use client";

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/app/_components/ui/sheet";
import { Barbershop, Rating } from "@prisma/client";
import { ChevronLeftIcon, MenuIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BarbershopInfoProps {
  barbershop: Barbershop;
  ratings?: Rating[];
}

const BarbershopInfo = ({ barbershop, ratings }: BarbershopInfoProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.replace("/");
  };

  const totalRatingValue =
    Array.isArray(ratings) && ratings.length
      ? ratings.reduce((accumulator, rating) => accumulator + rating.value, 0) /
        ratings.length
      : 0;

  return (
    <div>
      <div className="h-[250px] w-full relative">
        <Button
          size="icon"
          variant="outline"
          className="z-50 top-4 left-4 absolute"
          onClick={handleBackClick}
        >
          <ChevronLeftIcon />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="z-50 top-4 right-4 absolute"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>
        <Image
          src={barbershop.imageUrl}
          fill
          alt={barbershop.name}
          style={{
            objectFit: "cover",
          }}
          className="opacity-75"
        />
      </div>
      <div className="px-5 pt-3 pb-6 border-b border-solid border-secondary ">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="flex items-cente gap-1 mt-2">
          <MapPinIcon className="text-primary " size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>
        <div className="flex items-cente gap-1 mt-2">
          <StarIcon className="text-primary " size={18} />
          <p className="text-sm">
            {totalRatingValue} ({ratings?.length || 0}) Avaliações
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
