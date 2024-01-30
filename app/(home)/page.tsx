import Header from "../_components/header";
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
export default function Home() {
  return (

    <div>

      <Header />


      <div className="px-5 pt-5 ">
        <h2 className="text-xl font-bold">Olá, Lucas!</h2>
        <p className="capitalize text-sm">{format(new Date(), "EEEE',' dd 'De' MMMM", {
          locale: ptBR
        })}
        </p>
      </div>



    </div>

  );
}
