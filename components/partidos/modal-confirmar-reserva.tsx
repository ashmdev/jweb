"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import type { BalanceCredito } from "@/types/credito"

interface ModalConfirmarReservaProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  equipoNombre: string
  posicion: string
  costo: number
  balanceCreditos: BalanceCredito | null
  onConfirm: () => void
}

export default function ModalConfirmarReserva({
  open,
  onOpenChange,
  equipoNombre,
  posicion,
  costo,
  balanceCreditos,
  onConfirm,
}: ModalConfirmarReservaProps) {
  const creditosDisponibles = balanceCreditos?.disponible || 0
  const creditosDespues = creditosDisponibles - costo

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Confirmar Reserva de Posición</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Estás a punto de pagar {costo} créditos para reservar esta posición.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted rounded-lg p-6 my-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Tu posición</h3>
              <p className="text-muted-foreground">
                {posicion} - Equipo {equipoNombre}
              </p>
            </div>
            <div className="ml-auto bg-primary/10 text-primary px-4 py-2 rounded-lg font-bold">{costo} créditos</div>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 mb-2 flex justify-between items-center">
          <span>Tus créditos:</span>
          <span className="font-bold text-xl">{creditosDisponibles}</span>
        </div>

        <div className="bg-muted rounded-lg p-4 mb-6 flex justify-between items-center">
          <span>Después de la compra:</span>
          <span className="font-bold text-xl">{creditosDespues}</span>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="outline" className="flex-1 gap-2" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90" onClick={onConfirm}>
            <Check className="h-4 w-4" />
            Confirmar Pago
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
