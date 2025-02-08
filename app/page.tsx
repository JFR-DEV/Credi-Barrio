import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-beige flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-forest-green">Bienvenido a PagosVecinos</h1>
      <p className="text-xl md:text-2xl text-center mb-8 text-warm-gray">
        Siempre al día, siempre seguro, siempre confidencial
      </p>
      <div className="w-full max-w-md space-y-4">
        <Link href="/admin/register" passHref>
          <Button className="w-full bg-forest-green hover:bg-forest-green-dark text-white">
            Registrarse como Administrador
          </Button>
        </Link>
        <Link href="/admin/login" passHref>
          <Button
            variant="outline"
            className="w-full bg-warm-beige hover:bg-warm-beige-dark text-forest-green border-forest-green"
          >
            Iniciar sesión como Administrador
          </Button>
        </Link>
        <Link href="/cobrador/login" passHref>
          <Button
            variant="outline"
            className="w-full bg-warm-beige hover:bg-warm-beige-dark text-forest-green border-forest-green"
          >
            Iniciar sesión como Mensajero
          </Button>
        </Link>
      </div>
    </div>
  )
}

