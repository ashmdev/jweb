"use client"

import type React from "react"

import { useState } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ComentarioInput } from "@/types/comentario"

interface ComentarioFormProps {
  partidoId: number
  respuestaAId?: number
  onSubmit: (comentario: ComentarioInput) => Promise<void>
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function ComentarioForm({
  partidoId,
  respuestaAId,
  onSubmit,
  onCancel,
  placeholder = "Escribe un comentario...",
  autoFocus = false,
}: ComentarioFormProps) {
  const [texto, setTexto] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!texto.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El comentario no puede estar vacío",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        partidoId,
        texto: texto.trim(),
        respuestaAId,
      })
      setTexto("")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo enviar el comentario",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
        autoFocus={autoFocus}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isSubmitting || !texto.trim()}>
          {isSubmitting ? (
            "Enviando..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-1" />
              Enviar
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
