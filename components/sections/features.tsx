import { Calendar, Users, MapPin, Clock, Shield, Share2 } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Crea partidos fácilmente",
      description: "Selecciona fecha, hora y ubicación para organizar tu partido en segundos.",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Encuentra jugadores",
      description: "Únete a partidos existentes o invita a otros jugadores a completar tu equipo.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Canchas cercanas",
      description: "Descubre las mejores canchas disponibles en tu zona con información detallada.",
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Verificación de disponibilidad",
      description: "Confirma en tiempo real la disponibilidad de canchas y horarios.",
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Perfiles verificados",
      description: "Juega con confianza gracias a nuestro sistema de verificación de usuarios.",
    },
    {
      icon: <Share2 className="h-10 w-10 text-primary" />,
      title: "Invita amigos",
      description: "Comparte fácilmente los detalles del partido con tus amigos.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Características</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-secondary">
              Todo lo que necesitas para jugar fútbol
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join Fútbol simplifica la organización de partidos y te conecta con otros jugadores apasionados.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-secondary">{feature.title}</h3>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
