"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { businessTypes } from "@/lib/constants/business-types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import jsPDF from "jspdf"
import { currencies } from "@/lib/constants/currencies"
import { FavorActionsMenu } from "./FavorActionsMenu"

const generatePDF = (title: string, data: any[]) => {
  const doc = new jsPDF()
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.text(title, 10, 10)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  let y = 20
  data.forEach((item, index) => {
    Object.entries(item).forEach(([key, value]) => {
      const formattedKey =
        key.charAt(0).toUpperCase() +
        key
          .slice(1)
          .replace(/([A-Z])/g, " $1")
          .trim()
      doc.text(`${formattedKey}: ${value}`, 10, y)
      y += 10
    })
    if (index < data.length - 1) {
      doc.text("------------------------", 10, y)
      y += 10
    }
  })
  doc.save(`${title.toLowerCase().replace(/\s+/g, "_")}.pdf`)
}

const updateFavorStatus = (favor: any) => {
  const today = new Date()
  const startDate = new Date(favor.fechaInicio)
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
  const expectedAmount = daysPassed * Number(favor.montoADevolverPorPeriodo)

  if (favor.cobrado < expectedAmount) {
    return "ATRASADO"
  } else if (favor.cobrado >= Number(favor.amount)) {
    return "COMPLETADO"
  } else {
    return "AL DÍA"
  }
}

export default function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("resumen")
  const [routes, setRoutes] = useState<any[]>([])
  const [messengers, setMessengers] = useState<any[]>([])
  const [favors, setFavors] = useState<any[]>([])
  const [newRoute, setNewRoute] = useState({ name: "", description: "", fund: "", currency: "" })
  const [newMessenger, setNewMessenger] = useState({ apodo: "", route: "" })
  const [newFavor, setNewFavor] = useState({
    apodo: "",
    amount: "",
    businessType: "",
    description: "",
    messengerApodo: "",
    ubicacion: "",
    montoADevolverPorPeriodo: "",
    periodicidad: "diaria",
    fechaInicio: "",
    numeroPeriodos: "",
    zonaFondo: "", // Added zonaFondo
  })
  const [selectedZonaFondo, setSelectedZonaFondo] = useState("")
  const [selectedMessenger, setSelectedMessenger] = useState("")
  const [selectedDataType, setSelectedDataType] = useState("total")
  const [selectedMessengerId, setSelectedMessengerId] = useState<string | null>(null)
  const [messengerTasks, setMessengerTasks] = useState<{ [key: string]: string[] }>({})
  const [newTask, setNewTask] = useState("")
  const [messengerWorkdays, setMessengerWorkdays] = useState<{ [key: string]: any[] }>({})
  const [selectedMessengerMovements, setSelectedMessengerMovements] = useState<any[]>([])

  useEffect(() => {
    const storedRoutes = JSON.parse(localStorage.getItem("routes") || "[]")
    const storedMessengers = JSON.parse(localStorage.getItem("messengers") || "[]")
    const storedFavors = JSON.parse(localStorage.getItem("favors") || "[]")
    const storedTasks = JSON.parse(localStorage.getItem("messengerTasks") || "{}")
    const storedWorkdays = JSON.parse(localStorage.getItem("messengerWorkdays") || "{}")

    setRoutes(storedRoutes)
    setMessengers(storedMessengers)
    setFavors(storedFavors)
    setMessengerTasks(storedTasks)
    setMessengerWorkdays(storedWorkdays)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favors") {
        const updatedFavors = JSON.parse(e.newValue || "[]")
        setFavors(updatedFavors)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleAddRoute = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const updatedRoutes = [...routes, { ...newRoute, id: Date.now().toString() }]
    setRoutes(updatedRoutes)
    localStorage.setItem("routes", JSON.stringify(updatedRoutes))
    setNewRoute({ name: "", description: "", fund: "", currency: "" })
  }, [routes, newRoute])

  const handleAddMessenger = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const newMessengerId = Date.now().toString()
    const newMessengerData = { ...newMessenger, id: newMessengerId }
    const updatedMessengers = [...messengers, newMessengerData]
    setMessengers(updatedMessengers)
    localStorage.setItem("messengers", JSON.stringify(updatedMessengers))
    setNewMessenger({ apodo: "", route: "" })
    const routeSelect = document.getElementById("ruta") as HTMLSelectElement
    if (routeSelect) {
      routeSelect.value = ""
    }
  }, [messengers, newMessenger])

  const handleAddFavor = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const newFavorWithStatus = {
      ...newFavor,
      id: Date.now().toString(),
      status: "PENDIENTE",
      lastPayment: null,
      cobrado: 0,
      montoFinalADevolver: Number(newFavor.montoADevolverPorPeriodo) * Number(newFavor.numeroPeriodos),
    }
    const updatedFavors = [...favors, newFavorWithStatus]
    setFavors(updatedFavors)
    localStorage.setItem("favors", JSON.stringify(updatedFavors))
    setNewFavor({
      apodo: "",
      amount: "",
      businessType: "",
      description: "",
      messengerApodo: "",
      ubicacion: "",
      montoADevolverPorPeriodo: "",
      periodicidad: "diaria",
      fechaInicio: "",
      numeroPeriodos: "",
      zonaFondo: "",
    })
  }, [favors, newFavor])

  const handleEditRoute = (id: string) => {
    const routeToEdit = routes.find((route) => route.id === id)
    if (routeToEdit) {
      setNewRoute(routeToEdit)
      const updatedRoutes = routes.filter((route) => route.id !== id)
      setRoutes(updatedRoutes)
      localStorage.setItem("routes", JSON.stringify(updatedRoutes))
    }
  }

  const handleEditMessenger = (id: string) => {
    const messengerToEdit = messengers.find((messenger) => messenger.id === id)
    if (messengerToEdit) {
      setNewMessenger(messengerToEdit)
      setSelectedMessengerId(id)
      // Cargar movimientos del mensajero seleccionado
      const messengerMovements = JSON.parse(localStorage.getItem(`movements_${messengerToEdit.apodo}`) || "[]")
      setSelectedMessengerMovements(messengerMovements)
      // Cargar tareas del mensajero
      const messengerTasksData = JSON.parse(localStorage.getItem("messengerTasks") || "{}")
      setMessengerTasks(messengerTasksData)
      // Cargar días de trabajo del mensajero
      const messengerWorkdaysData = JSON.parse(localStorage.getItem("messengerWorkdays") || "{}")
      setMessengerWorkdays(messengerWorkdaysData)
      // Actualizar el desplegable de Zona-Fondo
      const routeSelect = document.getElementById("ruta") as HTMLSelectElement
      if (routeSelect) {
        routeSelect.value = messengerToEdit.route
      }
    }
  }

  const handleUpdateMessenger = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedMessengers = messengers.map((messenger) =>
      messenger.id === selectedMessengerId ? { ...newMessenger, id: selectedMessengerId } : messenger,
    )
    setMessengers(updatedMessengers)
    localStorage.setItem("messengers", JSON.stringify(updatedMessengers))
    setNewMessenger({ apodo: "", route: "" })
    setSelectedMessengerId(null)
    // Resetear el desplegable de Zona-Fondo
    const routeSelect = document.getElementById("ruta") as HTMLSelectElement
    if (routeSelect) {
      routeSelect.value = ""
    }
  }

  const handleEditFavor = (id: string) => {
    const favorToEdit = favors.find((favor) => favor.id === id)
    if (favorToEdit) {
      setNewFavor(favorToEdit)
      const updatedFavors = favors.filter((favor) => favor.id !== id)
      setFavors(updatedFavors)
      localStorage.setItem("favors", JSON.stringify(updatedFavors))
    }
  }

  const getTotalAmount = useCallback((zonaFondo: string, messengerApodo: string) => {
    return favors
      .filter(
        (favor) =>
          (!zonaFondo || routes.find((route) => route.name === favor.messengerApodo)?.name === zonaFondo) &&
          (!messengerApodo || favor.messengerApodo === messengerApodo),
      )
      .reduce((sum, favor) => sum + Number.parseFloat(favor.amount), 0)
  }, [favors, routes])

  const getCollectedAmount = useCallback((zonaFondo: string, messengerApodo: string) => {
    return favors
      .filter(
        (favor) =>
          (!zonaFondo || routes.find((route) => route.name === favor.messengerApodo)?.name === zonaFondo) &&
          (!messengerApodo || favor.messengerApodo === messengerApodo) &&
          favor.status === "Finalizado",
      )
      .reduce((sum, favor) => sum + Number.parseFloat(favor.amount), 0)
  }, [favors, routes])

  const getOutstandingBalance = useCallback((zonaFondo: string, messengerApodo: string) => {
    return getTotalAmount(zonaFondo, messengerApodo) - getCollectedAmount(zonaFondo, messengerApodo)
  }, [getTotalAmount, getCollectedAmount])

  const getLoanedAmount = useCallback((zonaFondo: string, messengerApodo: string) => {
    return favors
      .filter(
        (favor) =>
          (!zonaFondo || routes.find((route) => route.name === favor.messengerApodo)?.name === zonaFondo) &&
          (!messengerApodo || favor.messengerApodo === messengerApodo),
      )
      .reduce((sum, favor) => sum + Number.parseFloat(favor.amount), 0)
  }, [favors, routes])

  const chartData = useMemo(() => {
    switch (selectedDataType) {
      case "total":
        return [{ name: "Total", amount: getTotalAmount(selectedZonaFondo, selectedMessenger) }]
      case "prestado":
        return [{ name: "Prestado", amount: getLoanedAmount(selectedZonaFondo, selectedMessenger) }]
      case "recolectado":
        return [{ name: "Recolectado", amount: getCollectedAmount(selectedZonaFondo, selectedMessenger) }]
      default:
        return []
    }
  }, [selectedDataType, selectedZonaFondo, selectedMessenger, getTotalAmount, getLoanedAmount, getCollectedAmount])

  const handleDownloadRoutePDF = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId)
    if (route) {
      const routeData = [
        { Nombre: route.name },
        { Descripción: route.description },
        { Fondo: route.fund },
        { Moneda: route.currency },
      ]
      generatePDF("Reporte de Zona-Fondo", routeData)
    }
  }

  const handleDownloadMessengerPDF = (messengerId: string) => {
    const messenger = messengers.find((m) => m.id === messengerId)
    if (messenger) {
      const messengerData = [
        { Apodo: messenger.apodo },
        { "Zona-Fondo": messenger.route },
        { Tareas: messengerTasks[messengerId]?.join(", ") || "Ninguna" },
        { "Días de trabajo": messengerWorkdays[messengerId]?.length || 0 },
      ]
      generatePDF("Reporte de Mensajero", messengerData)
    }
  }

  const handleDownloadFavorPDF = (favorId: string) => {
    const favor = favors.find((f) => f.id === favorId)
    if (favor) {
      const favorData = [
        { "Apodo del cliente": favor.apodo },
        { "Monto del favor": `$${favor.amount}` },
        { "Monto a devolver por periodo": `$${favor.montoADevolverPorPeriodo}` },
        { "Número de periodos": favor.numeroPeriodos },
        { "Monto final a devolver": `$${Number(favor.montoADevolverPorPeriodo) * Number(favor.numeroPeriodos)}` },
        { Periodicidad: favor.periodicidad },
        { "Fecha de inicio": favor.fechaInicio },
        { "Tipo de negocio": businessTypes.find((type) => type.value === favor.businessType)?.label },
        { Ubicación: favor.ubicacion },
        { "Zona-Fondo": favor.zonaFondo },
        { Estado: favor.status },
        { "Último pago": favor.lastPayment ? `${favor.lastPayment.date} - $${favor.lastPayment.amount}` : "N/A" },
        { "Monto cobrado": `$${favor.cobrado || 0}` },
        {
          "Monto pendiente": `$${Number(favor.montoADevolverPorPeriodo) * Number(favor.numeroPeriodos) - (favor.cobrado || 0)}`,
        },
      ]
      generatePDF("Reporte de Favor", favorData)
    }
  }

  const handleDownloadSummaryPDF = () => {
    const summaryData = [
      { "Total Amount": getTotalAmount(selectedZonaFondo, selectedMessenger) },
      { "Collected Amount": getCollectedAmount(selectedZonaFondo, selectedMessenger) },
      { "Outstanding Balance": getOutstandingBalance(selectedZonaFondo, selectedMessenger) },
      { "Loaned Amount": getLoanedAmount(selectedZonaFondo, selectedMessenger) },
    ]
    generatePDF("Resumen", summaryData)
  }

  const handleChangeFavorStatus = (id: string, newStatus: string, paymentAmount?: number, paymentDate?: string) => {
    const updatedFavors = favors.map((favor) => {
      if (favor.id === id) {
        const updatedFavor = { ...favor, status: newStatus }
        if (paymentAmount && paymentDate) {
          updatedFavor.lastPayment = { date: paymentDate, amount: paymentAmount }
          updatedFavor.cobrado = (updatedFavor.cobrado || 0) + paymentAmount
        }
        updatedFavor.status = updateFavorStatus(updatedFavor)
        return updatedFavor
      }
      return favor
    })
    setFavors(updatedFavors)
    localStorage.setItem("favors", JSON.stringify(updatedFavors))
  }

  const handleAddTask = () => {
    if (selectedMessengerId && newTask) {
      const updatedTasks = {
        ...messengerTasks,
        [selectedMessengerId]: [...(messengerTasks[selectedMessengerId] || []), newTask],
      }
      setMessengerTasks(updatedTasks)
      localStorage.setItem("messengerTasks", JSON.stringify(updatedTasks))
      setNewTask("")
    }
  }

  const handleAddWorkday = (messengerId: string, workday: any) => {
    const updatedWorkdays = {
      ...messengerWorkdays,
      [messengerId]: [...(messengerWorkdays[messengerId] || []), workday],
    }
    setMessengerWorkdays(updatedWorkdays)
    localStorage.setItem("messengerWorkdays", JSON.stringify(updatedWorkdays))
  }

  const handlePrintMessengerInfo = (messengerId: string) => {
    const messenger = messengers.find((m) => m.id === messengerId)
    if (messenger) {
      const doc = new jsPDF()
      doc.text(`Información del Mensajero: ${messenger.apodo}`, 10, 10)
      doc.text(`Zona-Fondo: ${messenger.route}`, 10, 20)
      doc.text("Tareas Importantes:", 10, 30)
      const tasks = messengerTasks[messengerId] || []
      tasks.forEach((task, index) => {
        doc.text(`- ${task}`, 15, 40 + index * 10)
      })
      doc.text("Resumen de Trabajo:", 10, 40 + tasks.length * 10 + 10)
      const workdays = messengerWorkdays[messengerId] || []
      workdays.forEach((workday, index) => {
        doc.text(`Día ${index + 1}: ${workday.date}`, 15, 50 + tasks.length * 10 + index * 20)
        doc.text(`  Cobros: ${workday.collections}, Monto: $${workday.amount}`, 20, 60 + tasks.length * 10 + index * 20)
      })
      doc.save(`informe_mensajero_${messenger.apodo}.pdf`)
    }
  }

  const handleDeleteRoute = (id: string) => {
    const updatedRoutes = routes.filter((route) => route.id !== id)
    setRoutes(updatedRoutes)
    localStorage.setItem("routes", JSON.stringify(updatedRoutes))
  }

  const handleUpdateAllMessengers = () => {
    const updatedMessengers = messengers.map((messenger) => {
      const messengerMovements = JSON.parse(localStorage.getItem(`movements_${messenger.apodo}`) || "[]")
      const updatedMovements = messengerMovements.map((movement: any) => ({
        ...movement,
        status: "Actualizado",
      }))
      localStorage.setItem(`movements_${messenger.apodo}`, JSON.stringify(updatedMovements))
      return {
        ...messenger,
        movements: updatedMovements,
      }
    })

    setMessengers(updatedMessengers)
    setSelectedMessengerMovements(updatedMessengers.find((m) => m.id === selectedMessengerId)?.movements || [])
  }

  const handleDeleteMessenger = (id: string) => {
    const updatedMessengers = messengers.filter((messenger) => messenger.id !== id)
    setMessengers(updatedMessengers)
    localStorage.setItem("messengers", JSON.stringify(updatedMessengers))
  }

  const handleDeleteMovement = (messengerId: string, movementIndex: number) => {
    const messenger = messengers.find((m) => m.id === messengerId)
    if (messenger) {
      const updatedMovements = [...selectedMessengerMovements]
      updatedMovements.splice(movementIndex, 1)
      setSelectedMessengerMovements(updatedMovements)
      localStorage.setItem(`movements_${messenger.apodo}`, JSON.stringify(updatedMovements))
    }
  }

  const handleUpdateAllFavors = () => {
    const storedFavors = JSON.parse(localStorage.getItem("favors") || "[]")
    const updatedFavors = storedFavors.map((favor: any) => {
      const today = new Date()
      const startDate = new Date(favor.fechaInicio)
      const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
      const expectedAmount = daysPassed * Number(favor.montoADevolverPorPeriodo)

      return {
        ...favor,
        status: updateFavorStatus({
          ...favor,
          expectedAmount,
        }),
      }
    })

    setFavors(updatedFavors)
    localStorage.setItem("favors", JSON.stringify(updatedFavors))
    alert("Todos los favores han sido actualizados")
  }

  return (
    <div className="min-h-screen bg-warm-beige p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Panel de Administrador</h1>
          <Link href="/" passHref>
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="sticky top-0 z-10 bg-warm-beige pt-2 pb-4">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 gap-2">
              <TabsTrigger value="resumen" className="text-xs md:text-base whitespace-nowrap px-2">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="zona-fondos" className="text-xs md:text-base whitespace-nowrap px-2">
                Zona-Fondos
              </TabsTrigger>
              <TabsTrigger value="mensajeros" className="text-xs md:text-base whitespace-nowrap px-2">
                Mensajeros
              </TabsTrigger>
              <TabsTrigger value="favores" className="text-xs md:text-base whitespace-nowrap px-2">
                Favores
              </TabsTrigger>
              <TabsTrigger value="planes-pagos" className="text-xs md:text-base whitespace-nowrap px-2">
                Planes y Pagos
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resumen" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Resumen</CardTitle>
                <CardDescription>Vista general de la operación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <Select onValueChange={setSelectedZonaFondo}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar Zona-Fondo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las Zonas-Fondos</SelectItem>
                        {routes.map((route) => (
                          <SelectItem key={route.id} value={route.name}>
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedMessenger}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar Mensajero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los Mensajeros</SelectItem>
                        {messengers.map((messenger) => (
                          <SelectItem key={messenger.id} value={messenger.apodo}>
                            {messenger.apodo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedDataType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tipo de Información" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="prestado">Prestado</SelectItem>
                        <SelectItem value="recolectado">Recolectado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <Button onClick={handleDownloadSummaryPDF} className="mt-4">
                    Descargar Resumen PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zona-fondos" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Zona-Fondos</CardTitle>
                <CardDescription>Crea y administra zona-fondos</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddRoute} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="nombre-zona">Nombre de la Zona-Fondo</Label>
                      <Input
                        id="nombre-zona"
                        value={newRoute.name}
                        onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                        placeholder="Ingrese el nombre de la zona-fondo"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="descripcion-zona">Descripción</Label>
                      <Input
                        id="descripcion-zona"
                        value={newRoute.description}
                        onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
                        placeholder="Describa la zona-fondo"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="fondo">Fondo</Label>
                      <Input
                        id="fondo"
                        value={newRoute.fund}
                        onChange={(e) => setNewRoute({ ...newRoute, fund: e.target.value })}
                        placeholder="Ingrese el fondo"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="moneda">Moneda</Label>
                      <Select
                        onValueChange={(value) => setNewRoute({ ...newRoute, currency: value })}
                        value={newRoute.currency}
                      >
                        <SelectTrigger id="moneda">
                          <SelectValue placeholder="Seleccione una moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.name} ({currency.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">Guardar Zona-Fondo</Button>
                </form>
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Zona-Fondos Existentes</h3>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Descripción</TableHead>
                          <TableHead>Fondo</TableHead>
                          <TableHead>Moneda</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {routes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell>{route.name}</TableCell>
                            <TableCell>{route.description}</TableCell>
                            <TableCell>{route.fund}</TableCell>
                            <TableCell>{route.currency}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleDeleteRoute(route.id)}
                              >
                                Eliminar
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDownloadRoutePDF(route.id)}>
                                Descargar PDF
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensajeros" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Mensajeros</CardTitle>
                <CardDescription>Administra el equipo de mensajeros</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={selectedMessengerId ? handleUpdateMessenger : handleAddMessenger} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="apodo">Apodo</Label>
                      <Input
                        id="apodo"
                        value={newMessenger.apodo}
                        onChange={(e) => setNewMessenger({ ...newMessenger, apodo: e.target.value })}
                        placeholder="Apodo del mensajero"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="ruta">Zona-Fondo Asignada</Label>
                      <Select
                        onValueChange={(value) => setNewMessenger({ ...newMessenger, route: value })}
                        value={newMessenger.route}
                      >
                        <SelectTrigger id="ruta">
                          <SelectValue placeholder="Seleccione una zona-fondo" />
                        </SelectTrigger>
                        <SelectContent>
                          {routes.map((route) => (
                            <SelectItem key={route.id} value={route.name}>
                              {route.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">{selectedMessengerId ? "Actualizar Mensajero" : "Agregar Mensajero"}</Button>
                </form>
                <div className="mt-8 overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg md:text-xl font-semibold">Mensajeros Activos</h3>
                    <Button variant="outline" onClick={handleUpdateAllMessengers} className="flex items-center gap-2">
                      Actualizar Todos los Mensajeros
                    </Button>
                  </div>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Apodo</TableHead>
                          <TableHead>Zona-Fondo</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messengers.map((messenger) => (
                          <TableRow key={messenger.id}>
                            <TableCell>{messenger.apodo}</TableCell>
                            <TableCell>{messenger.route}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => handleDeleteMessenger(messenger.id)}
                              >
                                Eliminar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2"
                                onClick={() => setSelectedMessengerId(messenger.id)}
                              >
                                Ver Detalles
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrintMessengerInfo(messenger.id)}
                              >
                                Imprimir Info
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                {selectedMessengerId && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">
                      Movimientos del Mensajero: {messengers.find((m) => m.id === selectedMessengerId)?.apodo}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Historial de Movimientos</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Fecha</TableHead>
                              <TableHead>Favor</TableHead>
                              <TableHead>Monto</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedMessengerMovements.map((movement, index) => (
                              <TableRow key={index}>
                                <TableCell>{movement.date}</TableCell>
                                <TableCell>{movement.favor}</TableCell>
                                <TableCell>${movement.amount}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteMovement(selectedMessengerId, index)}
                                  >
                                    Eliminar
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favores" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Favores</CardTitle>
                <CardDescription>Administra los favores activos</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFavor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Datos generales */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="apodo">Apodo del Cliente</Label>
                      <Input
                        id="apodo"
                        value={newFavor.apodo}
                        onChange={(e) => setNewFavor({ ...newFavor, apodo: e.target.value })}
                        placeholder="Apodo del cliente"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="businessType">Tipo de Negocio</Label>
                      <Select onValueChange={(value) => setNewFavor({ ...newFavor, businessType: value })}>
                        <SelectTrigger id="businessType">
                          <SelectValue placeholder="Seleccione un tipo de negocio" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {" "}
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="ubicacion">Ubicación</Label>
                      <Input
                        id="ubicacion"
                        value={newFavor.ubicacion || ""}
                        onChange={(e) => setNewFavor({ ...newFavor, ubicacion: e.target.value })}
                        placeholder="Ubicación del favor"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="zonaFondo">Zona-Fondo Asignada</Label>
                      <Select onValueChange={(value) => setNewFavor({ ...newFavor, zonaFondo: value })}>
                        <SelectTrigger id="zonaFondo">
                          <SelectValue placeholder="Seleccione una zona-fondo" />
                        </SelectTrigger>
                        <SelectContent>
                          {routes.map((route) => (
                            <SelectItem key={route.id} value={route.name}>
                              {route.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5 md:col-span-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={newFavor.description}
                        onChange={(e) => setNewFavor({ ...newFavor, description: e.target.value })}
                        placeholder="Descripción del favor"
                      />
                    </div>
                    {/* Montos y pagos */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="monto">Monto del Favor</Label>
                      <Input
                        id="monto"
                        type="number"
                        value={newFavor.amount}
                        onChange={(e) => setNewFavor({ ...newFavor, amount: e.target.value })}
                        placeholder="Monto del favor"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="montoADevolverPorPeriodo">Monto a devolver por dia o semana</Label>
                      <Input
                        id="montoADevolverPorPeriodo"
                        type="number"
                        value={newFavor.montoADevolverPorPeriodo}
                        onChange={(e) => setNewFavor({ ...newFavor, montoADevolverPorPeriodo: e.target.value })}
                        placeholder="Monto a devolver por periodo"
                      />
                    </div>{" "}
                    <div className="flex flex-col space-y1.5">
                      <Label htmlFor="numeroPeriodos">Numero de Dias o semanas</Label>
                      <Input
                        id="numeroPeriodos"
                        type="number"
                        value={newFavor.numeroPeriodos}
                        onChange={(e) => setNewFavor({ ...newFavor, numeroPeriodos: e.target.value })}
                        placeholder="Número de periodos"
                      />{" "}
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="montoFinalADevolver">Monto al Final a Devolver</Label>
                      <Input
                        id="montoFinalADevolver"
                        type="number"
                        value={Number(newFavor.montoADevolverPorPeriodo) * Number(newFavor.numeroPeriodos)}
                        disabled
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="periodicidad">Periodicidad</Label>
                      <Select onValueChange={(value) => setNewFavor({ ...newFavor, periodicidad: value })}>
                        <SelectTrigger id="periodicidad">
                          <SelectValue placeholder="Seleccione la periodicidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diaria">Diaria</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                      <Input
                        id="fechaInicio"
                        type="date"
                        value={newFavor.fechaInicio}
                        onChange={(e) => setNewFavor({ ...newFavor, fechaInicio: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="messengerApodo">Mensajero Asignado</Label>
                      <Select onValueChange={(value) => setNewFavor({ ...newFavor, messengerApodo: value })}>
                        <SelectTrigger id="messengerApodo">
                          <SelectValue placeholder="Seleccione un mensajero" />
                        </SelectTrigger>
                        <SelectContent>
                          {messengers.map((messenger) => (
                            <SelectItem key={messenger.id} value={messenger.apodo}>
                              {messenger.apodo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">Crear Favor</Button>
                </form>
                <div className="mt-8 overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg md:text-xl font-semibold">Favores Activos</h3>
                    <Button variant="outline" onClick={handleUpdateAllFavors} className="flex items-center gap-2">
                      Actualizar Todos los Favores
                    </Button>
                  </div>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Apodo</TableHead>
                          <TableHead>Monto del Favor</TableHead>
                          <TableHead>Monto a Devolver por Periodo</TableHead>
                          <TableHead>Numero de Periodos</TableHead>
                          <TableHead>Monto al Final a Devolver</TableHead>
                          <TableHead>Periodicidad</TableHead>
                          <TableHead>Fecha de Inicio</TableHead>
                          <TableHead>Tipo de Negocio</TableHead>
                          <TableHead>Ubicación</TableHead>
                          <TableHead>Zona-Fondo</TableHead> {/* Updated TableHead */}
                          <TableHead>Estado</TableHead>
                          <TableHead>Último Pago</TableHead>
                          <TableHead>Monto bruto recolectado</TableHead>
                          <TableHead>Monto pendiente</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {favors.map((favor) => (
                          <TableRow key={favor.id}>
                            <TableCell>{favor.apodo}</TableCell>
                            <TableCell>${favor.amount}</TableCell>{" "}
                            <TableCell>${favor.montoADevolverPorPeriodo}</TableCell>
                            <TableCell>{favor.numeroPeriodos}</TableCell>
                            <TableCell>
                              ${Number(favor.montoADevolverPorPeriodo) * Number(favor.numeroPeriodos)}
                            </TableCell>
                            <TableCell>{favor.periodicidad}</TableCell>
                            <TableCell>{favor.fechaInicio}</TableCell>
                            <TableCell>
                              {businessTypes.find((type) => type.value === favor.businessType)?.label}
                            </TableCell>
                            <TableCell>{favor.ubicacion}</TableCell>
                            <TableCell>{favor.zonaFondo}</TableCell> {/* Updated TableCell */}
                            <TableCell>{favor.status}</TableCell>
                            <TableCell>{favor.lastPayment ? favor.lastPayment.date : "N/A"}</TableCell>
                            <TableCell>${favor.cobrado || 0}</TableCell>
                            <TableCell>
                              $
                              {Number(favor.montoADevolverPorPeriodo) * Number(favor.numeroPeriodos) -
                                (favor.cobrado || 0)}
                            </TableCell>
                            <TableCell>
                              <FavorActionsMenu
                                favor={favor}
                                onEdit={handleEditFavor}
                                onChangeStatus={handleChangeFavorStatus}
                                onDownloadPDF={handleDownloadFavorPDF}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="planes-pagos" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Planes y Pagos</CardTitle>
                <CardDescription>Gestiona los planes de suscripción y pagos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Planes de Suscripción</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
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
                      {
                        nombre: "Acuerdo a Medida",
                        prestamos: "+500",
                        precio: "Negociable",
                        emoji: "💬",
                        paypalLink: "#",
                      },
                    ].map((plan) => (
                      <Card key={plan.nombre}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            {plan.nombre} <span className="text-2xl">{plan.emoji}</span>
                          </CardTitle>
                          <CardDescription>{plan.prestamos} favores por mes</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl fontbold">{plan.precio}</p>
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
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Información de Pago</h3>
                    <p>
                      Los pagos se realizan a través de PayPal. Para actualizar su plan o realizar un pago, por favor
                      utilice los botones correspondientes a cada plan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

