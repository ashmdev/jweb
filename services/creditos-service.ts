import type { BalanceCredito, Credito } from "@/types/credito"

// Función para obtener el balance de créditos del usuario
export async function getBalanceCreditos(): Promise<BalanceCredito> {
  try {
    const response = await fetch("/api/creditos/balance")

    if (!response.ok) {
      throw new Error("Error al obtener el balance de créditos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en getBalanceCreditos:", error)
    throw error
  }
}

// Función para recargar créditos
export async function recargarCreditos(
  monto: number,
  metodo: "tarjeta" | "transferencia" | "efectivo",
): Promise<Credito> {
  try {
    const response = await fetch("/api/creditos/recargar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ monto, metodo }),
    })

    if (!response.ok) {
      throw new Error("Error al recargar créditos")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en recargarCreditos:", error)
    throw error
  }
}
