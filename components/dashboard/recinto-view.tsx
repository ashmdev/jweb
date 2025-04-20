import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, TrendingUp, MapPin, CalendarCheck, Clock, DollarSign } from "lucide-react"
import type { User } from "@/lib/auth"

interface RecintoViewProps {
  user: User
}

export default function RecintoView({ user }: RecintoViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Bienvenido, {user.name}</h1>
      <p className="text-muted-foreground">Administra tus recintos deportivos, reservas y visualiza estadísticas.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mis Recintos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+32 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jugadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">512</div>
            <p className="text-xs text-muted-foreground">+96 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,250</div>
            <p className="text-xs text-muted-foreground">+$850 desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reservas" className="mt-4">
        <TabsList>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="recintos">Mis Recintos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="reservas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Reservas</CardTitle>
              <CardDescription>Tienes 8 reservas programadas para los próximos días.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Partido {i}</p>
                      <p className="text-xs text-muted-foreground">
                        Recinto {(i % 3) + 1}, {new Date(Date.now() + i * 86400000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">{i === 1 ? "Mañana" : `En ${i} días`}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recintos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mis Recintos Deportivos</CardTitle>
              <CardDescription>Administra tus 3 recintos deportivos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Recinto Deportivo {i}</p>
                      <p className="text-xs text-muted-foreground">Dirección {i}, Ciudad</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {i === 1 ? "Activo" : i === 2 ? "Activo" : "En mantenimiento"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="estadisticas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de Uso</CardTitle>
              <CardDescription>Análisis de uso de tus recintos deportivos.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: <Clock />, title: "Horario más popular", value: "18:00 - 20:00" },
                  { icon: <Calendar />, title: "Día más reservado", value: "Sábado" },
                  { icon: <Users />, title: "Promedio de jugadores", value: "14 por partido" },
                  { icon: <TrendingUp />, title: "Crecimiento mensual", value: "+24%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {React.cloneElement(item.icon, { className: "h-5 w-5 text-primary" })}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
