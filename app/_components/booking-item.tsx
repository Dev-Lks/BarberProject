import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const BookingItem = () => {
  return (
    <Card>
      <CardContent className=" py-0 flex justify-between">
        <div className="flex flex-col gap-2 py-5">
          <Badge className="w-fit bg-[#221C3D] text-primary hover:bg-[#221C3D]">
            Confirmado
          </Badge>
          <h2 className="font-bold">Corte de Cabelo</h2>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h3>Vintage barber</h3>
          </div>
        </div>

        <div className="flex flex-col item-center justify-center border-l border-solid border-secondary px-3">
          <p className="text-sm">Fevereiro</p>
          <p className=" text-2xl ">06</p>
          <p className="text-sm">09:23</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingItem;
