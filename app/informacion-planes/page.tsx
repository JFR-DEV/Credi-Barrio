import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function InformacionPlanes() {
  return (
    <div className="min-h-screen bg-warm-beige p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Información sobre los Planes de Credi-Barrio</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Tarifas y Planes</h2>
          <p className="mb-2">
            Credi-Barrio ofrece los siguientes planes basados en el número de préstamos registrados por mes:
          </p>
          <ul className="list-disc pl-6 mb-2">
            <li>Gestión 0-10 préstamos: GRATIS</li>
            <li>Gestión 11-50 préstamos: 5 dólares</li>
            <li>Gestión 51-100 préstamos: 10 dólares</li>
            <li>Gestión 101-500 préstamos: 30 dólares</li>
            <li>Gestión más de 501 préstamos: Tarifa Negociada</li>
          </ul>
          <p>
            Los pagos se realizan a través de PayPal. Los enlaces de pago están disponibles en la sección de Planes y
            Pagos del panel de administrador.
          </p>
        </section>

        <Link href="/admin/register" passHref>
          <Button className="mt-6">Volver al Registro</Button>
        </Link>
      </div>
    </div>
  )
}

