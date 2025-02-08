"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // En una aplicación real, enviaríamos estos datos a un servidor
    // Aquí, simplemente los guardaremos en el almacenamiento local
    localStorage.setItem("user", JSON.stringify({ username, password }))
    router.push("/login")
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Registrarse
      </Button>
    </form>
  )
}

