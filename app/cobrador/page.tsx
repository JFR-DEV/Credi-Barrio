"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export default function CobradorDashboard() {
  const [activeTab, setActiveTab] = useState("rutas")

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Panel de Cobrador</h1>
          <Link href="/" passHref>
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="sticky top-0 z-10 bg-gray-100 pt-2 pb-4">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 gap-2">
              <TabsTrigger value="rutas" className="text-xs md:text-base whitespace-nowrap px-2">
                Rutas
              </TabsTrigger>
              <TabsTrigger value="cobros" className="text-xs md:text-base whitespace-nowrap px-2">
                Cobros
              </TabsTrigger>
              <TabsTrigger value="clientes" className="text-xs md:text-base whitespace-nowrap px-2">
                Clientes
              </TabsTrigger>
              <TabsTrigger value="marketing" className="text-xs md:text-base whitespace-nowrap px-2">
                Marketing
              </TabsTrigger>
              <TabsTrigger value="rendimiento" className="text-xs md:text-base whitespace-nowrap px-2">
                Stats
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Rutas Tab Content */}
          <TabsContent value="rutas" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Mis Rutas Asignadas</CardTitle>
                <CardDescription>Visualiza y gestiona tus rutas de cobro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ruta</TableHead>
                          <TableHead>Zona</TableHead>
                          <TableHead>Clientes</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Ruta Norte</TableCell>
                          <TableCell>Zona Norte</TableCell>
                          <TableCell>10</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cobros Tab Content */}
          <TabsContent value="cobros" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Registrar Cobro</CardTitle>
                <CardDescription>Ingresa los detalles del cobro realizado</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="cliente">Cliente</Label>
                      <Select>
                        <SelectTrigger id="cliente">
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ana">Ana López</SelectItem>
                          <SelectItem value="pedro">Pedro Sánchez</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="monto">Monto</Label>
                      <Input id="monto" type="number" placeholder="Monto del cobro" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="notas">Notas</Label>
                    <Textarea id="notas" placeholder="Observaciones del cobro" />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Registrar Cobro</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Clientes Tab Content */}
          <TabsContent value="clientes" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Clientes</CardTitle>
                <CardDescription>Administra la información de tus clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="Buscar cliente..." />
                  <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Dirección</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Ana López</TableCell>
                            <TableCell>555-0101</TableCell>
                            <TableCell>Calle Principal 123</TableCell>
                            <TableCell>Al día</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Ver Detalles
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab Content */}
          <TabsContent value="marketing" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Tareas de Marketing</CardTitle>
                <CardDescription>Registra actividades de promoción</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="tipo-tarea">Tipo de Tarea</Label>
                      <Select>
                        <SelectTrigger id="tipo-tarea">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="volantes">Volantes</SelectItem>
                          <SelectItem value="visitas">Visitas</SelectItem>
                          <SelectItem value="llamadas">Llamadas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="cantidad">Cantidad</Label>
                      <Input id="cantidad" type="number" placeholder="Cantidad realizada" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="notas-marketing">Notas</Label>
                    <Textarea id="notas-marketing" placeholder="Detalles de la actividad" />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Registrar Actividad</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Rendimiento Tab Content */}
          <TabsContent value="rendimiento" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Mi Rendimiento</CardTitle>
                <CardDescription>Estadísticas y métricas personales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Cobros del Mes</h3>
                    <p className="text-2xl font-bold">145</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Eficiencia</h3>
                    <p className="text-2xl font-bold">98%</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Total Cobrado</h3>
                    <p className="text-2xl font-bold">$58,000</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2">Comisiones</h3>
                    <p className="text-2xl font-bold">$2,900</p>
                  </div>
                </div>
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg font-semibold mb-4">Historial Mensual</h3>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mes</TableHead>
                          <TableHead>Cobros</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Eficiencia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Enero 2024</TableCell>
                          <TableCell>145</TableCell>
                          <TableCell>$58,000</TableCell>
                          <TableCell>98%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Diciembre 2023</TableCell>
                          <TableCell>138</TableCell>
                          <TableCell>$55,200</TableCell>
                          <TableCell>95%</TableCell>
                        </TableRow>
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

