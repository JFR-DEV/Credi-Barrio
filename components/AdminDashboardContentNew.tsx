"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { businessTypes } from "@/lib/constants/business-types"
import { currencies } from "@/lib/constants/currencies"
import { supabase, type ZonaFondo, type Mensajero, type Favor } from "@/lib/supabase"
import { Loader2, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, DollarSign, Users, MapPin, Trash2, Download, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']

export default function AdminDashboardContentNew() {
  const [activeTab, setActiveTab] = useState("resumen")
  const [loading, setLoading] = useState(false)
  const [zonas, setZonas] = useState<ZonaFondo[]>([])
  const [mensajeros, setMensajeros] = useState<Mensajero[]>([])
  const [favores, setFavores] = useState<Favor[]>([])

  const [newZona, setNewZona] = useState({ nombre: "", descripcion: "", fondo: "", moneda: "USD" })
  const [newMensajero, setNewMensajero] = useState({ apodo: "", zona_fondo_id: "" })
  const [newFavor, setNewFavor] = useState({
    apodo_cliente: "",
    monto_prestado: "",
    monto_por_periodo: "",
    numero_periodos: "",
    periodicidad: "diaria" as "diaria" | "semanal",
    fecha_inicio: "",
    tipo_negocio: "",
    ubicacion: "",
    descripcion: "",
    zona_fondo_id: "",
    mensajero_id: "",
  })

  const [selectedZonaFilter, setSelectedZonaFilter] = useState("")
  const [selectedMensajeroFilter, setSelectedMensajeroFilter] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [zonasRes, mensajerosRes, favoresRes] = await Promise.all([
        supabase.from('zona_fondos').select('*').order('created_at', { ascending: false }),
        supabase.from('mensajeros').select('*').order('created_at', { ascending: false }),
        supabase.from('favores').select('*').order('created_at', { ascending: false })
      ])

      if (zonasRes.data) setZonas(zonasRes.data)
      if (mensajerosRes.data) setMensajeros(mensajerosRes.data)
      if (favoresRes.data) setFavores(favoresRes.data)
    } catch (error) {
      toast.error("Error al cargar datos")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddZona = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newZona.nombre) {
      toast.error("El nombre es requerido")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.from('zona_fondos').insert([{
        nombre: newZona.nombre,
        descripcion: newZona.descripcion,
        fondo: parseFloat(newZona.fondo) || 0,
        moneda: newZona.moneda
      }]).select()

      if (error) throw error

      if (data) {
        setZonas([...zonas, data[0]])
        setNewZona({ nombre: "", descripcion: "", fondo: "", moneda: "USD" })
        toast.success("Zona-Fondo creada exitosamente")
      }
    } catch (error) {
      toast.error("Error al crear zona-fondo")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [newZona, zonas])

  const handleDeleteZona = useCallback(async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta zona?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from('zona_fondos').delete().eq('id', id)
      if (error) throw error

      setZonas(zonas.filter(z => z.id !== id))
      toast.success("Zona eliminada")
    } catch (error) {
      toast.error("Error al eliminar zona")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [zonas])

  const handleAddMensajero = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMensajero.apodo || !newMensajero.zona_fondo_id) {
      toast.error("Todos los campos son requeridos")
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.from('mensajeros').insert([{
        apodo: newMensajero.apodo,
        zona_fondo_id: newMensajero.zona_fondo_id
      }]).select()

      if (error) throw error

      if (data) {
        setMensajeros([...mensajeros, data[0]])
        setNewMensajero({ apodo: "", zona_fondo_id: "" })
        toast.success("Mensajero agregado exitosamente")
      }
    } catch (error) {
      toast.error("Error al agregar mensajero")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [newMensajero, mensajeros])

  const handleDeleteMensajero = useCallback(async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este mensajero?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from('mensajeros').delete().eq('id', id)
      if (error) throw error

      setMensajeros(mensajeros.filter(m => m.id !== id))
      toast.success("Mensajero eliminado")
    } catch (error) {
      toast.error("Error al eliminar mensajero")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [mensajeros])

  const handleAddFavor = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const { apodo_cliente, monto_prestado, monto_por_periodo, numero_periodos, fecha_inicio, mensajero_id } = newFavor

    if (!apodo_cliente || !monto_prestado || !monto_por_periodo || !numero_periodos || !fecha_inicio || !mensajero_id) {
      toast.error("Todos los campos requeridos deben completarse")
      return
    }

    setLoading(true)
    try {
      const monto_total = parseFloat(monto_por_periodo) * parseInt(numero_periodos)

      const { data, error } = await supabase.from('favores').insert([{
        apodo_cliente,
        monto_prestado: parseFloat(monto_prestado),
        monto_por_periodo: parseFloat(monto_por_periodo),
        numero_periodos: parseInt(numero_periodos),
        monto_total_devolver: monto_total,
        periodicidad: newFavor.periodicidad,
        fecha_inicio: newFavor.fecha_inicio,
        tipo_negocio: newFavor.tipo_negocio,
        ubicacion: newFavor.ubicacion,
        descripcion: newFavor.descripcion,
        zona_fondo_id: newFavor.zona_fondo_id,
        mensajero_id: newFavor.mensajero_id,
        estado: 'PENDIENTE'
      }]).select()

      if (error) throw error

      if (data) {
        setFavores([...favores, data[0]])
        setNewFavor({
          apodo_cliente: "",
          monto_prestado: "",
          monto_por_periodo: "",
          numero_periodos: "",
          periodicidad: "diaria",
          fecha_inicio: "",
          tipo_negocio: "",
          ubicacion: "",
          descripcion: "",
          zona_fondo_id: "",
          mensajero_id: "",
        })
        toast.success("Favor creado exitosamente")
      }
    } catch (error) {
      toast.error("Error al crear favor")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [newFavor, favores])

  const handleDeleteFavor = useCallback(async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este favor?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from('favores').delete().eq('id', id)
      if (error) throw error

      setFavores(favores.filter(f => f.id !== id))
      toast.success("Favor eliminado")
    } catch (error) {
      toast.error("Error al eliminar favor")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [favores])

  const favoresFiltrados = useMemo(() => {
    return favores.filter(f => {
      const matchZona = !selectedZonaFilter || f.zona_fondo_id === selectedZonaFilter
      const matchMensajero = !selectedMensajeroFilter || f.mensajero_id === selectedMensajeroFilter
      return matchZona && matchMensajero
    })
  }, [favores, selectedZonaFilter, selectedMensajeroFilter])

  const estadisticas = useMemo(() => {
    const totalPrestado = favoresFiltrados.reduce((sum, f) => sum + f.monto_prestado, 0)
    const totalEsperado = favoresFiltrados.reduce((sum, f) => sum + f.monto_total_devolver, 0)
    const totalCobrado = favoresFiltrados.reduce((sum, f) => sum + f.monto_cobrado, 0)
    const pendiente = totalEsperado - totalCobrado

    const porEstado = favoresFiltrados.reduce((acc, f) => {
      acc[f.estado] = (acc[f.estado] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalPrestado,
      totalEsperado,
      totalCobrado,
      pendiente,
      ganancia: totalCobrado - totalPrestado,
      cantidadFavores: favoresFiltrados.length,
      porEstado
    }
  }, [favoresFiltrados])

  const datosGraficoEstados = useMemo(() => {
    return Object.entries(estadisticas.porEstado).map(([estado, cantidad]) => ({
      name: estado,
      value: cantidad
    }))
  }, [estadisticas.porEstado])

  const datosGraficoMontos = useMemo(() => {
    return [
      { name: 'Prestado', monto: estadisticas.totalPrestado },
      { name: 'Esperado', monto: estadisticas.totalEsperado },
      { name: 'Cobrado', monto: estadisticas.totalCobrado },
      { name: 'Pendiente', monto: estadisticas.pendiente }
    ]
  }, [estadisticas])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Panel de Control
            </h1>
            <p className="text-slate-600 mt-1">Gestión de préstamos y cobranzas</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">Salir</Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="resumen" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              📊 Resumen
            </TabsTrigger>
            <TabsTrigger value="zona-fondos" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-1" /> Zonas
            </TabsTrigger>
            <TabsTrigger value="mensajeros" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-1" /> Mensajeros
            </TabsTrigger>
            <TabsTrigger value="favores" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-1" /> Préstamos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription>Total Prestado</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <DollarSign className="text-emerald-500" />
                    ${estadisticas.totalPrestado.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription>Total Cobrado</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CheckCircle2 className="text-blue-500" />
                    ${estadisticas.totalCobrado.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription>Pendiente</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <AlertCircle className="text-amber-500" />
                    ${estadisticas.pendiente.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription>Ganancia Proyectada</CardDescription>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {estadisticas.ganancia >= 0 ? (
                      <TrendingUp className="text-purple-500" />
                    ) : (
                      <TrendingDown className="text-red-500" />
                    )}
                    ${estadisticas.ganancia.toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estados de Préstamos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosGraficoEstados}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {datosGraficoEstados.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosGraficoMontos}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="monto" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Select value={selectedZonaFilter} onValueChange={setSelectedZonaFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todas las zonas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las zonas</SelectItem>
                    {zonas.map(z => (
                      <SelectItem key={z.id} value={z.id}>{z.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedMensajeroFilter} onValueChange={setSelectedMensajeroFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos los mensajeros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los mensajeros</SelectItem>
                    {mensajeros.map(m => (
                      <SelectItem key={m.id} value={m.id}>{m.apodo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zona-fondos" className="animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Crear Zona-Fondo</CardTitle>
                <CardDescription>Gestiona las zonas geográficas y fondos</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddZona} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre-zona">Nombre</Label>
                      <Input
                        id="nombre-zona"
                        value={newZona.nombre}
                        onChange={(e) => setNewZona({ ...newZona, nombre: e.target.value })}
                        placeholder="Ej: Zona Norte"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fondo">Fondo Inicial</Label>
                      <Input
                        id="fondo"
                        type="number"
                        value={newZona.fondo}
                        onChange={(e) => setNewZona({ ...newZona, fondo: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="moneda">Moneda</Label>
                      <Select value={newZona.moneda} onValueChange={(value) => setNewZona({ ...newZona, moneda: value })}>
                        <SelectTrigger id="moneda">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(c => (
                            <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="descripcion-zona">Descripción</Label>
                      <Input
                        id="descripcion-zona"
                        value={newZona.descripcion}
                        onChange={(e) => setNewZona({ ...newZona, descripcion: e.target.value })}
                        placeholder="Descripción opcional"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Crear Zona-Fondo
                  </Button>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Zonas Existentes ({zonas.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zonas.map(zona => (
                      <Card key={zona.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{zona.nombre}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteZona(zona.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription>{zona.descripcion || "Sin descripción"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-emerald-600">
                            {zona.fondo.toLocaleString()} {zona.moneda}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mensajeros" className="animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Mensajero</CardTitle>
                <CardDescription>Gestiona tu equipo de cobradores</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMensajero} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apodo-mensajero">Apodo</Label>
                      <Input
                        id="apodo-mensajero"
                        value={newMensajero.apodo}
                        onChange={(e) => setNewMensajero({ ...newMensajero, apodo: e.target.value })}
                        placeholder="Ej: El Rápido"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zona-mensajero">Zona Asignada</Label>
                      <Select
                        value={newMensajero.zona_fondo_id}
                        onValueChange={(value) => setNewMensajero({ ...newMensajero, zona_fondo_id: value })}
                      >
                        <SelectTrigger id="zona-mensajero">
                          <SelectValue placeholder="Selecciona una zona" />
                        </SelectTrigger>
                        <SelectContent>
                          {zonas.map(z => (
                            <SelectItem key={z.id} value={z.id}>{z.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Agregar Mensajero
                  </Button>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Mensajeros Activos ({mensajeros.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mensajeros.map(mensajero => {
                      const zona = zonas.find(z => z.id === mensajero.zona_fondo_id)
                      const favoresAsignados = favores.filter(f => f.mensajero_id === mensajero.id)
                      return (
                        <Card key={mensajero.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">👤 {mensajero.apodo}</CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMensajero(mensajero.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardDescription>
                              <MapPin className="inline h-3 w-3 mr-1" />
                              {zona?.nombre || "Sin zona"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-slate-600">
                              {favoresAsignados.length} préstamos asignados
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favores" className="animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Crear Préstamo</CardTitle>
                <CardDescription>Registra un nuevo favor/préstamo</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddFavor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="apodo-cliente">Apodo del Cliente *</Label>
                      <Input
                        id="apodo-cliente"
                        value={newFavor.apodo_cliente}
                        onChange={(e) => setNewFavor({ ...newFavor, apodo_cliente: e.target.value })}
                        placeholder="Ej: Doña María"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="monto-prestado">Monto Prestado *</Label>
                      <Input
                        id="monto-prestado"
                        type="number"
                        step="0.01"
                        value={newFavor.monto_prestado}
                        onChange={(e) => setNewFavor({ ...newFavor, monto_prestado: e.target.value })}
                        placeholder="1000.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="monto-periodo">Cuota por Período *</Label>
                      <Input
                        id="monto-periodo"
                        type="number"
                        step="0.01"
                        value={newFavor.monto_por_periodo}
                        onChange={(e) => setNewFavor({ ...newFavor, monto_por_periodo: e.target.value })}
                        placeholder="50.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="numero-periodos">Número de Períodos *</Label>
                      <Input
                        id="numero-periodos"
                        type="number"
                        value={newFavor.numero_periodos}
                        onChange={(e) => setNewFavor({ ...newFavor, numero_periodos: e.target.value })}
                        placeholder="30"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="periodicidad">Periodicidad *</Label>
                      <Select
                        value={newFavor.periodicidad}
                        onValueChange={(value: "diaria" | "semanal") => setNewFavor({ ...newFavor, periodicidad: value })}
                      >
                        <SelectTrigger id="periodicidad">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diaria">Diaria</SelectItem>
                          <SelectItem value="semanal">Semanal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fecha-inicio">Fecha de Inicio *</Label>
                      <Input
                        id="fecha-inicio"
                        type="date"
                        value={newFavor.fecha_inicio}
                        onChange={(e) => setNewFavor({ ...newFavor, fecha_inicio: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipo-negocio">Tipo de Negocio</Label>
                      <Select
                        value={newFavor.tipo_negocio}
                        onValueChange={(value) => setNewFavor({ ...newFavor, tipo_negocio: value })}
                      >
                        <SelectTrigger id="tipo-negocio">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map(bt => (
                            <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ubicacion-favor">Ubicación</Label>
                      <Input
                        id="ubicacion-favor"
                        value={newFavor.ubicacion}
                        onChange={(e) => setNewFavor({ ...newFavor, ubicacion: e.target.value })}
                        placeholder="Dirección o referencia"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zona-favor">Zona</Label>
                      <Select
                        value={newFavor.zona_fondo_id}
                        onValueChange={(value) => setNewFavor({ ...newFavor, zona_fondo_id: value })}
                      >
                        <SelectTrigger id="zona-favor">
                          <SelectValue placeholder="Selecciona zona" />
                        </SelectTrigger>
                        <SelectContent>
                          {zonas.map(z => (
                            <SelectItem key={z.id} value={z.id}>{z.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mensajero-favor">Mensajero Asignado *</Label>
                      <Select
                        value={newFavor.mensajero_id}
                        onValueChange={(value) => setNewFavor({ ...newFavor, mensajero_id: value })}
                      >
                        <SelectTrigger id="mensajero-favor">
                          <SelectValue placeholder="Selecciona mensajero" />
                        </SelectTrigger>
                        <SelectContent>
                          {mensajeros.map(m => (
                            <SelectItem key={m.id} value={m.id}>{m.apodo}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="descripcion-favor">Descripción</Label>
                      <Textarea
                        id="descripcion-favor"
                        value={newFavor.descripcion}
                        onChange={(e) => setNewFavor({ ...newFavor, descripcion: e.target.value })}
                        placeholder="Notas adicionales..."
                        rows={2}
                      />
                    </div>
                  </div>
                  {newFavor.monto_por_periodo && newFavor.numero_periodos && (
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-sm text-emerald-800">
                        <strong>Total a devolver:</strong> ${(parseFloat(newFavor.monto_por_periodo) * parseInt(newFavor.numero_periodos)).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <Button type="submit" disabled={loading} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Crear Préstamo
                  </Button>
                </form>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Préstamos Registrados ({favores.length})</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Prestado</TableHead>
                          <TableHead>A Devolver</TableHead>
                          <TableHead>Cobrado</TableHead>
                          <TableHead>Pendiente</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Mensajero</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {favores.map(favor => {
                          const mensajero = mensajeros.find(m => m.id === favor.mensajero_id)
                          const pendiente = favor.monto_total_devolver - favor.monto_cobrado
                          return (
                            <TableRow key={favor.id} className="hover:bg-slate-50">
                              <TableCell className="font-medium">{favor.apodo_cliente}</TableCell>
                              <TableCell>${favor.monto_prestado.toLocaleString()}</TableCell>
                              <TableCell>${favor.monto_total_devolver.toLocaleString()}</TableCell>
                              <TableCell className="text-emerald-600 font-semibold">
                                ${favor.monto_cobrado.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-amber-600 font-semibold">
                                ${pendiente.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  favor.estado === 'COMPLETADO' ? 'bg-emerald-100 text-emerald-800' :
                                  favor.estado === 'AL_DIA' ? 'bg-blue-100 text-blue-800' :
                                  favor.estado === 'ATRASADO' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {favor.estado}
                                </span>
                              </TableCell>
                              <TableCell>{mensajero?.apodo || 'N/A'}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteFavor(favor.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
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
