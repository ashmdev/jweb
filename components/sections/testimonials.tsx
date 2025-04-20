import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Carlos Rodríguez",
      role: "Jugador amateur",
      content:
        "Join Fútbol ha cambiado la forma en que organizo mis partidos. Ahora puedo encontrar jugadores rápidamente y las canchas siempre están disponibles.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      name: "Laura Martínez",
      role: "Capitana de equipo",
      content:
        "Como capitana, me encanta poder organizar partidos y ver quién se une. La función de seleccionar posiciones en la cancha es genial.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      name: "Miguel Sánchez",
      role: "Jugador ocasional",
      content:
        "Antes era difícil encontrar partidos cuando tenía tiempo libre. Con Join Fútbol, siempre encuentro un partido al que unirme cerca de mi casa.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Testimonios</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-secondary">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Miles de jugadores ya están disfrutando de Join Fútbol para organizar sus partidos.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
