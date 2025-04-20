export interface Credito {
  id: number
  monto: number
  fecha: string
  metodo: "tarjeta" | "transferencia" | "efectivo"
  estado: "completado" | "pendiente" | "fallido"
  referencia: string
}

export interface BalanceCredito {
  total: number
  disponible: number
  pendiente: number
  historial: Credito[]
}
