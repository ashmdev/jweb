import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Download } from "lucide-react"

export default function Hero() {
  return (
    <section id="hero" className="relative py-20 md:py-28 overflow-hidden bg-secondary text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Encuentra tu partido de fútbol ideal
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                Join Fútbol te conecta con jugadores en tu área. Crea partidos, únete a equipos y juega en las mejores
                canchas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                <Download className="mr-2 h-5 w-5" /> Descargar ahora
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Saber más <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full bg-gray-300 ring-2 ring-white" />
                  ))}
                </div>
                <span className="ml-2 text-gray-200">+1000 usuarios activos</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span className="ml-1 text-gray-200">4.8/5 en App Store</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto lg:mx-0 w-full max-w-[350px] lg:max-w-none">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/placeholder.svg?height=600&width=300"
                width={300}
                height={600}
                alt="Join Fútbol App"
                className="w-full h-auto"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -right-6 h-[350px] w-[350px] rounded-full bg-primary/30 blur-3xl" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_0%,#072c35_100%)] opacity-80" />
    </section>
  )
}
