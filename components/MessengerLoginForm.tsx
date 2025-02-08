"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function MessengerLoginForm() {
  const [apodo, setApodo] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const messengers = JSON.parse(localStorage.getItem("messengers") || "[]")
    const messenger = messengers.find((m: any) => m.apodo === apodo)
    if (messenger) {
      localStorage.setItem("isMessengerLoggedIn", "true")
      localStorage.setItem("currentMessenger", JSON.stringify(messenger))
      router.push("/cobrador/dashboard")
    } else {
      alert("Apodo no encontrado")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="apodo">Apodo</Label>
        <Input id="apodo" type="text" value={apodo} onChange={(e) => setApodo(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Iniciar sesión como Mensajero
      </Button>
    </form>
  )
}

