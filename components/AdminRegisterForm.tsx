"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function AdminRegisterForm() {
  const [formData, setFormData] = useState({
    apodo: "",
    password: "",
  })
  const router = useRouter()

  useEffect(() => {
    const savedFormData = localStorage.getItem("adminRegisterForm")
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("adminRegisterForm", JSON.stringify(formData))
  }, [formData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const admin = {
      apodo: formData.apodo,
      password: formData.password,
      role: "admin",
    }
    localStorage.setItem("admin", JSON.stringify(admin))
    localStorage.removeItem("adminRegisterForm")
    router.push("/admin/login")
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <Label htmlFor="apodo">Apodo-Usuario</Label>
        <Input id="apodo" name="apodo" type="text" value={formData.apodo} onChange={handleInputChange} required />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Información sobre los Planes</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Vecino Inicial: 0-10 favores/mes - Gratis</li>
          <li>Barrio Activo: 11-50 favores/mes - $20 USD</li>
          <li>Comunidad Full: 51-100 favores/mes - $30 USD</li>
          <li>Zona en Marcha: 101-200 favores/mes - $50 USD</li>
          <li>Ciudad Expandida: 201-500 favores/mes - $100 USD</li>
          <li>Acuerdo a Medida: +500 favores/mes - Precio negociable</li>
        </ul>
        <p className="mt-2">
          Los pagos se realizan a través de PayPal. Para más detalles, consulte la sección de Planes y Pagos en el panel
          de administrador.
        </p>
      </div>
      <Button type="submit" className="w-full">
        Registrarse como Administrador
      </Button>
    </form>
  )
}

