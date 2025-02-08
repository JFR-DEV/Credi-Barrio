"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function AdminLoginForm() {
  const [apodo, setApodo] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const admin = JSON.parse(localStorage.getItem("admin") || "{}")
    if (admin.apodo === apodo && admin.password === password) {
      localStorage.setItem("isAdminLoggedIn", "true")
      router.push("/admin/dashboard")
    } else {
      alert("Credenciales incorrectas")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="apodo">Nombre de usuario</Label>
        <Input id="apodo" type="text" value={apodo} onChange={(e) => setApodo(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Iniciar sesión como Administrador
      </Button>
    </form>
  )
}

