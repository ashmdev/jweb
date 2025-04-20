"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getHashtagsPopulares } from "@/services/publicaciones-service"
import { useToast } from "@/hooks/use-toast"

interface Hashtag {
  id: number
  texto: string
  count: number
}

export function HashtagTrending() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const cargarHashtags = async () => {
      try {
        setIsLoading(true)
        const data = await getHashtagsPopulares()
        setHashtags(data)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "No se pudieron cargar los hashtags",
        })
      } finally {
        setIsLoading(false)
      }
    }

    cargarHashtags()
  }, [toast])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tendencias
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {hashtags.map((hashtag) => (
              <li key={hashtag.id} className="flex justify-between items-center">
                <Link href={`/dashboard/comunidad/hashtag/${hashtag.texto}`} className="text-primary hover:underline">
                  #{hashtag.texto}
                </Link>
                <span className="text-sm text-muted-foreground">{hashtag.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
