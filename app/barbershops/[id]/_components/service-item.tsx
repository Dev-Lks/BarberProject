"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale/pt-BR";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getDayBookingss } from "../_actions/get-day-bookings";
interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem = ({
  barbershop,
  service,
  isAuthenticated,
}: ServiceItemProps) => {
  const router = useRouter();

  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [hour, setHour] = useState<string | undefined>();

  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setShetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  console.log({ dayBookings });

  useEffect(() => {
    if (!date) {
      return;
    }
    const refreshAvailablehours = async () => {
      const _dayBookings = await getDayBookingss(barbershop.id, date);

      setDayBookings(_dayBookings);
    };

    refreshAvailablehours();
  }, [barbershop.id, date]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => {
    setHour(time);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }

      const dateHour = Number(hour.split(":")[0]);
      const dateMinutes = Number(hour.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: service.barbershopId,
        date: newDate,
        userId: (data.user as any).id,
      });
      setShetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast("Reserva realizada com Sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMM 'ás' HH ':' mm."),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitIsLoading(false);
    }
  };
  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinute = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinute === timeMinutes;
      });
      if (!booking) {
        return true;
      } else {
        return false;
      }
    });
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className="p-3 ">
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              className="rounded-lg "
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold text-sm">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-primary font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setShetIsOpen}>
                <SheetTrigger asChild>
                  <Button onClick={handleBooking} variant="secondary">
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0 ">
                  <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      fromDate={new Date()}
                      locale={ptBR}
                      styles={{
                        cell: {
                          width: "100%",
                        },
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>
                  {/* Mostrar lista de horarios apenas se uma data for selecionada */}
                  {date && (
                    <div className=" flex overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] gap-3 py-6 px-5 border-y border-solid border-secondary">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleHourClick(time)}
                          variant={hour === time ? "default" : "outline"}
                          key={time}
                          className="rounded-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="py-6 px-5 border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3 flex flex-col gap-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data</h3>
                            <h4 className="text-sm capitalize">
                              {format(date, "dd 'de' MMMM", { locale: ptBR })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm capitalize">{hour}</h4>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barberaria</h3>
                          <h4 className="text-sm capitalize">
                            {barbershop.name}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className="px-5">
                    <Button
                      onClick={handleBookingSubmit}
                      disabled={(!hour && !date) || submitIsLoading}
                    >
                      {submitIsLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirmar Reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
