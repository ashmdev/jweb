"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Users,
  Calendar,
  MapPin,
  Settings,
  LogOut,
  Menu,
  User,
  PieChart,
  BellIcon as Whistle,
  Trophy,
  FileText,
} from "lucide-react"
import type { User as AuthUser } from "@/lib/auth"
import { useUserStore } from "@/lib/stores/user-store"

interface SidebarProps {
  user: AuthUser
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const setUser = useUserStore((state) => state.setUser)

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      // Eliminar el usuario del store
      setUser(null)
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Menú según el rol del usuario
  const getMenuItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: <Home className="h-5 w-5" />,
      },
      {
        title: "Perfil",
        href: "/dashboard/perfil",
        icon: <User className="h-5 w-5" />,
      },
      {
        title: "Configuración",
        href: "/dashboard/configuracion",
        icon: <Settings className="h-5 w-5" />,
      },
    ]

    if (user.role === "administrador") {
      return [
        ...commonItems,
        {
          title: "Usuarios",
          href: "/dashboard/usuarios",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "Recintos",
          href: "/dashboard/recintos",
          icon: <MapPin className="h-5 w-5" />,
        },
        {
          title: "Blog",
          href: "/dashboard/blog",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Estadísticas",
          href: "/dashboard/estadisticas",
          icon: <PieChart className="h-5 w-5" />,
        },
      ]
    }

    if (user.role === "administrador-de-recinto-deportivo") {
      return [
        ...commonItems,
        {
          title: "Mis Recintos",
          href: "/dashboard/mis-recintos",
          icon: <MapPin className="h-5 w-5" />,
        },
        {
          title: "Reservas",
          href: "/dashboard/reservas",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          title: "Estadísticas",
          href: "/dashboard/estadisticas",
          icon: <PieChart className="h-5 w-5" />,
        },
      ]
    }

    // Modificar la función getMenuItems para incluir la opción de Mis Amigos para el rol de jugador

    // Buscar la sección donde se definen los elementos del menú para el jugador y agregar la opción de Mis Amigos
    // Debería estar alrededor de la línea 100, después de "Partidos" y antes de "Torneos"

    // Jugador
    return [
      ...commonItems,
      {
        title: "Partidos",
        href: "/dashboard/partidos",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "Mis Partidos",
        href: "/dashboard/mis-partidos",
        icon: <Whistle className="h-5 w-5" />,
      },
      {
        title: "Buscar Partidos",
        href: "/dashboard/buscar-partidos",
        icon: <Calendar className="h-5 w-5" />,
      },
      {
        title: "Mis Amigos",
        href: "/dashboard/mis-amigos",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Comunidad",
        href: "/dashboard/comunidad",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Torneos",
        href: "/dashboard/torneos",
        icon: <Trophy className="h-5 w-5" />,
      },
    ]
  }

  const menuItems = getMenuItems()

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Join Fútbol</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
                pathname === item.href ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="mt-2 w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Sidebar para pantallas grandes */}
      <aside className="hidden lg:flex h-full w-64 flex-col border-r">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden absolute left-4 top-3 z-50">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
