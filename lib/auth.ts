import { cookies } from "next/headers"

export type User = {
  id: number
  name: string
  email: string
  role: "administrador" | "administrador-de-recinto-deportivo" | "jugador"
  avatar?: string
}

export function getUser(): User | null {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie?.value) {
      // Para propósitos de desarrollo, devolver un usuario demo si no hay cookie
      // En producción, esto debería ser null
      return {
        id: 999,
        name: "Usuario Demo",
        email: "demo@joinfutbol.com",
        role: "jugador",
      }
    }

    // Intentar parsear el JSON
    const userData = JSON.parse(userCookie.value) as User

    // Verificar que los campos necesarios existan
    if (!userData || !userData.id || !userData.role) {
      return null
    }

    return userData
  } catch (error) {
    console.error("Error al obtener usuario de la cookie:", error)
    return null
  }
}

export async function getUserFromCookie(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie?.value) {
      return null
    }

    const userData = JSON.parse(userCookie.value) as User

    if (!userData || !userData.id || !userData.role) {
      return null
    }

    return userData
  } catch (error) {
    console.error("Error al obtener usuario de la cookie:", error)
    return null
  }
}

export function checkRole(allowedRoles: User["role"][]) {
  const user = getUser()

  if (!user) {
    return false
  }

  return allowedRoles.includes(user.role)
}
