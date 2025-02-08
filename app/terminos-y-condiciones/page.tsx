import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">1. Tarifas y Planes</h2>
          <p className="mb-2">
            Paga-Fácil ofrece los siguientes planes basados en el número de préstamos registrados por mes:
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

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">2. Almacenamiento de Datos</h2>
          <p>
            Los registros de préstamos son eliminables y no almacenables una vez que se ha completado el pago del
            préstamo respectivo. Es responsabilidad del usuario exportar o guardar cualquier información que desee
            conservar antes de que se elimine.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">3. Uso del Servicio</h2>
          <p>
            El usuario se compromete a utilizar Paga-Fácil de manera ética y legal. Cualquier uso fraudulento o ilegal
            del servicio resultará en la terminación inmediata de la cuenta.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">4. Privacidad y Seguridad</h2>
          <p>
            Paga-Fácil se compromete a proteger la privacidad y seguridad de los datos de sus usuarios. Sin embargo, es
            responsabilidad del usuario mantener seguras sus credenciales de acceso.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">5. Modificaciones</h2>
          <p>
            Paga-Fácil se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los
            usuarios serán notificados de cualquier cambio significativo.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">6. Limitación de Responsabilidad</h2>
          <p>
            Paga-Fácil no se hace responsable de cualquier pérdida financiera o de datos que pueda resultar del uso de
            nuestro servicio. Los usuarios utilizan la plataforma bajo su propio riesgo.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">7. Ley Aplicable</h2>
          <p>
            Estos términos y condiciones se rigen por las leyes del país donde Paga-Fácil está registrado. Cualquier
            disputa relacionada con estos términos será resuelta en los tribunales de dicha jurisdicción.
          </p>
        </section>

        <Link href="/" passHref>
          <Button className="mt-6">Volver al Inicio</Button>
        </Link>
      </div>
    </div>
  )
}

