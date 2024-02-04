"use client";

import SideMenu from "@/app/_components/side-menu";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/app/_components/ui/sheet";
import { Barbershop, Rating } from "@prisma/client";
import { ChevronLeftIcon, MenuIcon, MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RateBarbershop from "./rate-barbershop";
import { useCallback, useMemo, useState } from "react";
import { saveRating } from "@/app/_actions/rate";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { refreshBarbershop } from "../_actions/refresh-rates";
import { toast } from "sonner";

interface BarbershopInfoProps {
  barbershop: Barbershop;
  ratings?: Rating[];
}

const items: number[] = [...(new Array(5).keys() as any)];

const BarbershopInfo = ({ barbershop, ratings }: BarbershopInfoProps) => {
  const session = useSession();
  const router = useRouter();

  const [selectedRating, setSelectedRating] = useState<number>();

  const handleBackClick = useCallback(() => {
    router.replace("/");
  }, [router]);

  const totalRatingValue = useMemo(() => {
    if (ratings?.length) {
      return (
        ratings.reduce(
          (accumulator, rating) => accumulator + Number(rating.value),
          0
        ) / ratings.length
      );
    }
    return 0;
  }, [ratings]);

  const onClickStar = useCallback((index: number) => {
    setSelectedRating((oldState) => (oldState === index ? undefined : index));
  }, []);

  const handleConfirmRating = useCallback(() => {
    if (selectedRating !== undefined) {
      // Add logic to send the selectedRating to the database
      saveRating({
        value: selectedRating + 1, // Pass the number of stars (+1 because index is 0-based)
        userId: session.data?.user?.id as string, // Replace with actual user ID,
        barbershopId: barbershop.id,
      });
      refreshBarbershop();
      toast.success("Avaliação enviada com sucesso!");
    }
  }, [selectedRating, session, barbershop]);

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
          layout="fill"
          objectFit="cover"
          alt={barbershop.name}
          className="opacity-75"
        />
      </div>
      <div className="flex justify-between border-b border-solid border-secondary">
        <div className="px-5 pt-3 pb-6 ">
          <h1 className="text-xl font-bold">{barbershop.name}</h1>
          <div className="flex  gap-1 mt-2">
            <MapPinIcon className="text-primary " size={18} />
            <p className="text-sm">{barbershop.address}</p>
          </div>

          <div className="flex gap-1 mt-2">
            <StarIcon className="text-primary " size={18} />
            <p className="text-sm">
              {totalRatingValue.toFixed(1)} ({ratings?.length || 0}) Avaliações
            </p>
          </div>
        </div>

        <div className="px-5 pt-3 pb-6 flex items-center ">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Deixe sua avaliação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="border-b border-solid border-secondary p-6 w-full">
                <DialogTitle className="text-center">
                  Deixe sua Avaliação
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center flex-col gap-4 justify-center mt-2">
                <div>
                  {items.map((index) => (
                    <RateBarbershop
                      onClick={() => onClickStar(index)}
                      key={`star_${index}`}
                      isActive={index <= selectedRating!}
                    />
                  ))}
                </div>
                <DialogClose asChild>
                  {selectedRating !== undefined && (
                    <div>
                      <Button onClick={handleConfirmRating}>
                        Confirmar Avaliação
                      </Button>
                    </div>
                  )}
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
