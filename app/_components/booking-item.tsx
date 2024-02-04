"use client";

import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const handleCancelClick = async () => {
    setSubmitIsLoading(true);
    try {
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com Sucesso");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };
  const isBookingConfirmed = isFuture(booking.date);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full lg:max-w-[100%]">
          <CardContent className="flex py-0 px-0">
            <div className="flex flex-col gap-2 py-5 pl-5 flex-[3]">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <h3>{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-col items-center flex-1 justify-center border-l border-solid border-secondary">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", {
                  locale: ptBR,
                })}
              </p>
              <p className=" text-2xl ">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "hh:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="px-0">
        <SheetHeader className=" px-5 text-left pb-6 border-b border-solid border-secondary">
          <SheetTitle>Informações da Reserva</SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image fill src={"/static/images/Image.png"} alt={booking.barbershop.name} />
            <div className="w-full absolute bottom-4 left-0 px-5 ">
              <Card className="">
                <CardContent className="flex gap-2 p-3">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="text-xs overflow-hidden text-nowrap text-ellipsis">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="">
            <Badge
              variant={isBookingConfirmed ? "default" : "secondary"}
              className="w-fit my-3"
            >
              {isBookingConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>

            <Card>
              <CardContent className="p-3 flex flex-col gap-3">
                <div className="flex justify-between">
                  <h2 className="font-bold">{booking.service.name}</h2>
                  <h3 className="font-bold text-sm">
                    {Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(booking.service.price))}
                  </h3>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm">Data</h3>
                  <h4 className="text-sm capitalize">
                    {format(booking.date, "dd 'de' MMMM", { locale: ptBR })}
                  </h4>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm">Horário</h3>
                  <h4 className="text-sm capitalize">
                    {format(booking.date, "hh:mm")}
                  </h4>
                </div>
                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm">Barberaria</h3>
                  <h4 className="text-sm capitalize">
                    {booking.barbershop.name}
                  </h4>
                </div>
              </CardContent>
            </Card>
          </div>
          <SheetFooter className="flex flex-row gap-3 mt-6">
            <Button variant="secondary" className="w-full">
              Voltar
            </Button>
            <SheetClose asChild>
              <Button
                onClick={handleCancelClick}
                disabled={!isBookingConfirmed || submitIsLoading}
                variant="destructive"
                className="w-full"
              >
                {submitIsLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cancelar Reserva
              </Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
