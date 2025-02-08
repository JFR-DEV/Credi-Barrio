"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Panel de Administrador</h1>
          <Link href="/" passHref>
            <Button variant="outline">Volver al Inicio</Button>
          </Link>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="sticky top-0 z-10 bg-gray-100 pt-2 pb-4">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 gap-2">
              <TabsTrigger value="dashboard" className="text-xs md:text-base whitespace-nowrap px-2">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="rutas" className="text-xs md:text-base whitespace-nowrap px-2">
                Rutas
              </TabsTrigger>
              <TabsTrigger value="cobradores" className="text-xs md:text-base whitespace-nowrap px-2">
                Cobradores
              </TabsTrigger>
              <TabsTrigger value="prestamos" className="text-xs md:text-base whitespace-nowrap px-2">
                Préstamos
              </TabsTrigger>
              <TabsTrigger value="configuracion" className="text-xs md:text-base whitespace-nowrap px-2">
                Config.
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab Content */}
          <TabsContent value="dashboard" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Resumen</CardTitle>
                <CardDescription>Vista general de la operación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Total Clientes</h3>
                    <p className="text-2xl md:text-3xl font-bold">1,234</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Préstamos Activos</h3>
                    <p className="text-2xl md:text-3xl font-bold">789</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Tasa de Pago</h3>
                    <p className="text-2xl md:text-3xl font-bold">95%</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Monto Total</h3>
                    <p className="text-2xl md:text-3xl font-bold">$1.2M</p>
                  </div>
                </div>
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Rendimiento de Cobradores</h3>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Cobros</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Eficiencia</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Juan Pérez</TableCell>
                          <TableCell>145</TableCell>
                          <TableCell>$58,000</TableCell>
                          <TableCell>98%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>María García</TableCell>
                          <TableCell>132</TableCell>
                          <TableCell>$52,800</TableCell>
                          <TableCell>95%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rutas Tab Content */}
          <TabsContent value="rutas" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Rutas</CardTitle>
                <CardDescription>Crea y administra rutas de cobro</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="nombre-ruta">Nombre de la Ruta</Label>
                      <Input id="nombre-ruta" placeholder="Ingrese el nombre de la ruta" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="zona">Zona</Label>
                      <Input id="zona" placeholder="Ingrese la zona" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="descripcion-ruta">Descripción</Label>
                    <Textarea id="descripcion-ruta" placeholder="Describa la ruta" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="cobrador-asignado">Cobrador Asignado</Label>
                    <Select>
                      <SelectTrigger id="cobrador-asignado">
                        <SelectValue placeholder="Seleccione un cobrador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="juan">Juan Pérez</SelectItem>
                        <SelectItem value="maria">María García</SelectItem>
                        <SelectItem value="carlos">Carlos Rodríguez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </form>
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Rutas Existentes</h3>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Zona</TableHead>
                          <TableHead>Cobrador</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Ruta Norte</TableCell>
                          <TableCell>Zona Norte</TableCell>
                          <TableCell>Juan Pérez</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button className="w-full sm:w-auto">Guardar Ruta</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Cobradores Tab Content */}
          <TabsContent value="cobradores" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Cobradores</CardTitle>
                <CardDescription>Administra el equipo de cobradores</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input id="nombre" placeholder="Nombre del cobrador" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" placeholder="Número de teléfono" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Correo electrónico" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="ruta">Ruta Asignada</Label>
                      <Select>
                        <SelectTrigger id="ruta">
                          <SelectValue placeholder="Seleccione una ruta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="norte">Ruta Norte</SelectItem>
                          <SelectItem value="sur">Ruta Sur</SelectItem>
                          <SelectItem value="este">Ruta Este</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Cobradores Activos</h3>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Teléfono</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Ruta</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Juan Pérez</TableCell>
                          <TableCell>555-0101</TableCell>
                          <TableCell>juan@example.com</TableCell>
                          <TableCell>Ruta Norte</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button className="w-full sm:w-auto">Agregar Cobrador</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Préstamos Tab Content */}
          <TabsContent value="prestamos" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Gestión de Préstamos</CardTitle>
                <CardDescription>Administra los préstamos activos</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="cliente">Cliente</Label>
                      <Input id="cliente" placeholder="Nombre del cliente" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="monto">Monto</Label>
                      <Input id="monto" type="number" placeholder="Monto del préstamo" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="plazo">Plazo (días)</Label>
                      <Input id="plazo" type="number" placeholder="Plazo en días" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="tasa">Tasa de Interés (%)</Label>
                      <Input id="tasa" type="number" step="0.01" placeholder="Tasa de interés" />
                    </div>
                  </div>
                </form>
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg md:text-xl font-semibold mb-4">Préstamos Activos</h3>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Plazo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Ana López</TableCell>
                          <TableCell>$1,000</TableCell>
                          <TableCell>30 días</TableCell>
                          <TableCell>Activo</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="mr-2">
                              Ver
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancelar
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button className="w-full sm:w-auto">Crear Préstamo</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Configuración Tab Content */}
          <TabsContent value="configuracion" className="mt-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Configuración del Sistema</CardTitle>
                <CardDescription>Ajusta los parámetros generales</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="tasa-default">Tasa de Interés por Defecto (%)</Label>
                      <Input id="tasa-default" type="number" step="0.01" placeholder="Ej: 5.00" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="plazo-max">Plazo Máximo (días)</Label>
                      <Input id="plazo-max" type="number" placeholder="Ej: 30" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="monto-min">Monto Mínimo ($)</Label>
                      <Input id="monto-min" type="number" placeholder="Ej: 500" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="monto-max">Monto Máximo ($)</Label>
                      <Input id="monto-max" type="number" placeholder="Ej: 5000" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="comision">Comisión de Cobradores (%)</Label>
                      <Input id="comision" type="number" step="0.01" placeholder="Ej: 2.50" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="dias-gracia">Días de Gracia</Label>
                      <Input id="dias-gracia" type="number" placeholder="Ej: 3" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
                <Button variant="outline" className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button className="w-full sm:w-auto">Guardar Configuración</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

