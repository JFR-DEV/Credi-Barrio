import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface TermsAndConditionsModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
}

export function TermsAndConditionsModal({ isOpen, onClose, onAccept }: TermsAndConditionsModalProps) {
  const [canAccept, setCanAccept] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current
        if (scrollHeight - scrollTop <= clientHeight + 1) {
          setCanAccept(true)
        }
      }
    }

    const currentRef = contentRef.current
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll)
      // Llamar a checkScroll inmediatamente después de montar el componente
      checkScroll()
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setCanAccept(false)
      // Llamar a checkScroll después de que el contenido se haya renderizado
      setTimeout(checkScroll, 0)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Términos y Condiciones</DialogTitle>
          <DialogDescription>Por favor, lee cuidadosamente los siguientes términos y condiciones.</DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-auto pr-4" ref={contentRef}>
          <div className="space-y-4">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Tarifas y Planes</h2>
              <p>Paga-Fácil ofrece los siguientes planes basados en el número de préstamos registrados por mes:</p>
              <ul className="list-disc pl-6 my-2">
                <li>Gestión 0-10 préstamos: GRATIS</li>
                <li>Gestión 11-50 préstamos: 5 dólares</li>
                <li>Gestión 51-100 préstamos: 10 dólares</li>
                <li>Gestión 101-500 préstamos: 30 dólares</li>
                <li>Gestión más de 501 préstamos: Tarifa Negociada</li>
              </ul>
              <p>
                Los pagos se realizan a través de PayPal. Los enlaces de pago están disponibles en la sección de Planes
                y Pagos del panel de administrador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Almacenamiento de Datos</h2>
              <p>
                Los registros de préstamos son eliminables y no almacenables una vez que se ha completado el pago del
                préstamo respectivo. Es responsabilidad del usuario exportar o guardar cualquier información que desee
                conservar antes de que se elimine.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Uso del Servicio</h2>
              <p>
                El usuario se compromete a utilizar Paga-Fácil de manera ética y legal. Cualquier uso fraudulento o
                ilegal del servicio resultará en la terminación inmediata de la cuenta.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Privacidad y Seguridad</h2>
              <p>
                Paga-Fácil se compromete a proteger la privacidad y seguridad de los datos de sus usuarios. Sin embargo,
                es responsabilidad del usuario mantener seguras sus credenciales de acceso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Modificaciones</h2>
              <p>
                Paga-Fácil se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Los
                usuarios serán notificados de cualquier cambio significativo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Limitación de Responsabilidad</h2>
              <p>
                Paga-Fácil no se hace responsable de cualquier pérdida financiera o de datos que pueda resultar del uso
                de nuestro servicio. Los usuarios utilizan la plataforma bajo su propio riesgo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Propiedad Intelectual</h2>
              <p>
                Todo el contenido y software de Paga-Fácil está protegido por derechos de autor y otras leyes de
                propiedad intelectual. Los usuarios no pueden copiar, modificar o distribuir nuestro contenido sin
                autorización expresa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Terminación del Servicio</h2>
              <p>
                Paga-Fácil se reserva el derecho de terminar o suspender el acceso a nuestros servicios en cualquier
                momento, por cualquier razón, sin previo aviso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Ley Aplicable</h2>
              <p>
                Estos términos y condiciones se rigen por las leyes del país donde Paga-Fácil está registrado. Cualquier
                disputa relacionada con estos términos será resuelta en los tribunales de dicha jurisdicción.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Contacto</h2>
              <p>
                Si tienes alguna pregunta sobre estos términos y condiciones, por favor contáctanos a través de nuestro
                sitio web o envíanos un correo electrónico a support@paga-facil.com.
              </p>
            </section>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
          <Button onClick={onAccept} disabled={!canAccept}>
            {canAccept ? "He leído y acepto" : "Desplázate hasta el final para aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

