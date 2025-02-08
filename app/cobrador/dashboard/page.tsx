"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const updateFavorStatus = (favor: any): string => {
  return (favor.cobrado || 0) + favor.lastPayment.amount >= favor.amount ? "Finalizado" : "Al día"
}

export default function MessengerDashboard() {
  const [activeTab, setActiveTab] = useState("movimientos")
  const [messenger, setMessenger] = useState<any>(null)
  const [routes, setRoutes] = useState<any[]>([])
  const [favors, setFavors] = useState<any[]>([])
  const [movements, setMovements] = useState<any[]>([])
  const [newMovement, setNewMovement] = useState({ favorId: "", amount: "", date: "" })
  const [activities, setActivities] = useState<any[]>([])
  const [newActivity, setNewActivity] = useState({ type: "", location: "", date: "" })
  const [paymentAlerts, setPaymentAlerts] = useState<{ [key: string]: boolean }>({})
  const [selectedZonaFondo, setSelectedZonaFondo] = useState("")
  const router = useRouter()

  useEffect(() => {
    const isMessengerLoggedIn = localStorage.getItem("isMessengerLoggedIn")
    if (!isMessengerLoggedIn) {
      router.push("/cobrador/login")
    }
    const storedMessenger = JSON.parse(localStorage.getItem("currentMessenger") || "{}")
    setMessenger(storedMessenger)

    // Load data from local storage
    const storedRoutes = JSON.parse(localStorage.getItem("routes") || "[]")
    const storedFavors = JSON.parse(localStorage.getItem("favors") || "[]")

    setRoutes(storedRoutes)
    setFavors(storedFavors)

    // Load movements and marketing activities (if they exist)
    const storedMovements = JSON.parse(localStorage.getItem(`movements_${storedMessenger.apodo}`) || "[]")
    setMovements(storedMovements)
    const storedActivities = JSON.parse(localStorage.getItem(`activities_${storedMessenger.apodo}`) || "[]")
    setActivities(storedActivities)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isMessengerLoggedIn")
    localStorage.removeItem("currentMessenger")
    router.push("/cobrador/login")
  }

  const handleNewMovement = (e: React.FormEvent) => {
    e.preventDefault()
    const favorSeleccionado = favors.find((f) => f.id === newMovement.favorId)
    if (!favorSeleccionado) {
      alert("Por favor, seleccione un favor válido.")
      return
    }
    const movementRegistered = {
      id: Date.now().toString(),
      favorId: newMovement.favorId,
      favor: favorSeleccionado.apodo,
      amount: Number.parseFloat(newMovement.amount),
      date: newMovement.date,
    }
    const updatedMovements = [...movements, movementRegistered]
    setMovements(updatedMovements)
    localStorage.setItem(`movements_${messenger.apodo}`, JSON.stringify(updatedMovements))

    // Update the favor's last payment and status
    const updatedFavors = favors.map((favor) => {
      if (favor.id === newMovement.favorId) {
        const updatedFavor = {
          ...favor,
          lastPayment: {
            date: newMovement.date,
            amount: movementRegistered.amount,
          },
          cobrado: (favor.cobrado || 0) + movementRegistered.amount,
        }
        updatedFavor.status = updateFavorStatus(updatedFavor)
        return updatedFavor
      }
      return favor
    })
    setFavors(updatedFavors)
    localStorage.setItem("favors", JSON.stringify(updatedFavors))

    // Set payment alert
    setPaymentAlerts((prev) => ({ ...prev, [newMovement.favorId]: true }))

    setNewMovement({ favorId: "", amount: "", date: "" })
  }

  const handleNewActivity = (e: React.FormEvent) => {
    e.preventDefault()
    const activity = {
      id: Date.now().toString(),
      type: newActivity.type,
      location: newActivity.location,
      date: newActivity.date,
    }
    const updatedActivities = [...activities, activity]
    setActivities(updatedActivities)
    localStorage.setItem(`activities_${messenger.apodo}`, JSON.stringify(updatedActivities))
    setNewActivity({ type: "", location: "", date: "" })
  }

  const handleZonaFondoChange = (value: string) => {
    setSelectedZonaFondo(value)
  }

  return (
    <div className="min-h-screen bg-warm-beige">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header Section - Fixed at top */}
        <div className="sticky top-0 z-50 bg-warm-beige border-b border-forest-green/10 px-4 py-3">
          <div className="max-w-6xl mx-auto flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-forest-green">Panel de Mensajero</h1>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Cerrar sesión
              </Button>
            </div>
            {/* Navigation Tabs - Scrollable on mobile */}
            <div className="w-full overflow-x-auto pb-2 -mb-2">
              <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0 h-10 items-center justify-start sm:justify-center gap-1 p-1">
                <TabsTrigger value="movimientos" className="flex-1 sm:flex-none">
                  Movimientos
                </TabsTrigger>
                <TabsTrigger value="marketing" className="flex-1 sm:flex-none">
                  Marketing
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* Main Content Section - Scrollable */}
        <div className="p-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <Label htmlFor="zona-fondo">Zona-Fondo</Label>
              <Select onValueChange={handleZonaFondoChange}>
                <SelectTrigger id="zona-fondo">
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

            <TabsContent value="movimientos">
              <Card>
                <CardHeader>
                  <CardTitle>Registrar Movimiento</CardTitle>
                  <CardDescription>Ingresa los detalles del movimiento realizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewMovement} className="space-y-4">
                    <div>
                      <Label htmlFor="favor">Favor</Label>
                      <Select onValueChange={(value) => setNewMovement({ ...newMovement, favorId: value })}>
                        <SelectTrigger id="favor">
                          <SelectValue placeholder="Selecciona un favor" />
                        </SelectTrigger>
                        <SelectContent>
                          {favors
                            .filter((favor) => favor.zonaFondo === selectedZonaFondo)
                            .map((favor) => (
                              <SelectItem key={favor.id} value={favor.id}>
                                {favor.apodo}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="amount">Monto</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newMovement.amount}
                        onChange={(e) => setNewMovement({ ...newMovement, amount: e.target.value })}
                        placeholder="Monto del movimiento"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newMovement.date}
                        onChange={(e) => setNewMovement({ ...newMovement, date: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Registrar Movimiento</Button>
                  </form>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Movimientos Recientes</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Favor</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {movements.map((movement) => (
                          <TableRow key={movement.id}>
                            <TableCell>{movement.favor}</TableCell>
                            <TableCell>${movement.amount}</TableCell>
                            <TableCell>{movement.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <CardTitle>Actividades de Marketing</CardTitle>
                  <CardDescription>Registra tus actividades de promoción</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleNewActivity} className="space-y-4">
                    <div>
                      <Label htmlFor="type">Tipo de Actividad</Label>
                      <Select onValueChange={(value) => setNewActivity({ ...newActivity, type: value })}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Volanteo">Volanteo</SelectItem>
                          <SelectItem value="Visitas">Visitas</SelectItem>
                          <SelectItem value="Llamadas">Llamadas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={newActivity.location}
                        onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                        placeholder="Ubicación de la actividad"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newActivity.date}
                        onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit">Registrar Actividad</Button>
                  </form>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Actividades Recientes</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Ubicación</TableHead>
                          <TableHead>Fecha</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell>{activity.type}</TableCell>
                            <TableCell>{activity.location}</TableCell>
                            <TableCell>{activity.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

