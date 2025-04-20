import Image from "next/image"

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Crea un partido",
      description: "Selecciona fecha, hora y cancha para tu partido. Verifica la disponibilidad en tiempo real.",
      image: "/placeholder.svg?height=400&width=200",
    },
    {
      number: "02",
      title: "Elige tu posición",
      description: "Visualiza la cancha y selecciona dónde quieres jugar. Personaliza tu experiencia.",
      image: "/placeholder.svg?height=400&width=200",
    },
    {
      number: "03",
      title: "Invita jugadores",
      description: "Comparte el partido con amigos o permite que otros jugadores se unan para completar equipos.",
      image: "/placeholder.svg?height=400&width=200",
    },
    {
      number: "04",
      title: "¡A jugar!",
      description: "Recibe notificaciones, confirma asistencia y disfruta de tu partido organizado sin complicaciones.",
      image: "/placeholder.svg?height=400&width=200",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Cómo funciona</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-secondary">
              Organiza partidos en 4 simples pasos
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join Fútbol hace que organizar y unirse a partidos sea más fácil que nunca.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="relative h-[400px] w-[200px] overflow-hidden rounded-3xl shadow-lg">
                  <Image src={step.image || "/placeholder.svg"} alt={step.title} fill className="object-cover" />
                </div>
                <div className="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-secondary">{step.title}</h3>
              <p className="mt-2 text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
