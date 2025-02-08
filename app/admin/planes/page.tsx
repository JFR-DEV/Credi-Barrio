"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PlanesPage() {
  const [loanCount, setLoanCount] = useState(0)
  const [currentPlan, setCurrentPlan] = useState("Vecino Inicial")

  useEffect(() => {
    const storedLoanCount = Number.parseInt(localStorage.getItem("loanCount") || "0")
    setLoanCount(storedLoanCount)
    updateCurrentPlan(storedLoanCount)
  }, [])

  const updateCurrentPlan = (count: number) => {
    if (count <= 10) setCurrentPlan("Vecino Inicial")
    else if (count <= 50) setCurrentPlan("Barrio Activo")
    else if (count <= 100) setCurrentPlan("Comunidad Full")
    else if (count <= 200) setCurrentPlan("Zona en Marcha")
    else if (count <= 500) setCurrentPlan("Ciudad Expandida")
    else setCurrentPlan("Acuerdo a Medida")
  }

  const planes = [
    { nombre: "Vecino Inicial", prestamos: "0-10", precio: "Gratis", emoji: "✅", paypalLink: "#" },
    {
      nombre: "Barrio Activo",
      prestamos: "11-50",
      precio: "$20 USD",
      emoji: "🔥",
      paypalLink: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BASICO",
    },
    {
      nombre: "Comunidad Full",
      prestamos: "51-100",
      precio: "$30 USD",
      emoji: "🚀",
      paypalLink: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ESTANDAR",
    },
    {
      nombre: "Zona en Marcha",
      prestamos: "101-200",
      precio: "$50 USD",
      emoji: "💼",
      paypalLink: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PREMIUM",
    },
    {
      nombre: "Ciudad Expandida",
      prestamos: "201-500",
      precio: "$100 USD",
      emoji: "🌆",
      paypalLink: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PREMIUM_PLUS",
    },
    { nombre: "Acuerdo a Medida", prestamos: "+500", precio: "Negociable", emoji: "💬", paypalLink: "#" },
  ]

  return (
    <div className="min-h-screen bg-warm-beige p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-forest-green">Planes y Pagos</h1>
          <Link href="/admin/dashboard" passHref>
            <Button variant="outline">Volver al Dashboard</Button>
          </Link>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tu Plan Actual</CardTitle>
            <CardDescription>Basado en el número de favores registrados este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Plan: <strong>{currentPlan}</strong>
            </p>
            <p>
              Favores registrados: <strong>{loanCount}</strong>
            </p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planes.map((plan) => (
            <Card key={plan.nombre}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.nombre} <span className="text-2xl">{plan.emoji}</span>
                </CardTitle>
                <CardDescription>{plan.prestamos} favores por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{plan.precio}</p>
              </CardContent>
              <CardFooter>
                {plan.nombre === "Acuerdo a Medida" ? (
                  <Button disabled>Contactar para cotización</Button>
                ) : plan.nombre === "Vecino Inicial" ? (
                  <Button disabled>Plan Actual</Button>
                ) : (
                  <Link href={plan.paypalLink} passHref>
                    <Button>Pagar con PayPal</Button>
                  </Link>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

