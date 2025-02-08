import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface FavorActionsMenuProps {
  favor: any
  onEdit: (id: string) => void
  onChangeStatus: (id: string, status: string, amount?: number, date?: string) => void
  onDownloadPDF: (id: string) => void
}

export function FavorActionsMenu({ favor, onEdit, onChangeStatus, onDownloadPDF }: FavorActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(favor.id)}>Editar</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(favor.id, "Al día")}>Marcar Al día</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(favor.id, "Atrasado")}>Marcar Atrasado</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(favor.id, "Finalizado")}>Marcar Finalizado</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const amount = prompt("Ingrese el monto del pago:")
            const date = prompt("Ingrese la fecha del pago (YYYY-MM-DD):")
            if (amount && date) {
              onChangeStatus(favor.id, "Al día", Number(amount), date)
            }
          }}
        >
          Registrar Pago
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownloadPDF(favor.id)}>Descargar PDF</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

