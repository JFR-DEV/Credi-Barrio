import React from "react"

export function AdminDashboard() {
  return (
    <div className="bg-gray-100 h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard del Administrador</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total Clientes</h2>
          <p className="text-3xl font-bold">150</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Préstamos Activos</h2>
          <p className="text-3xl font-bold">120</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Tasa de Pago</h2>
          <p className="text-3xl font-bold">97%</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Monto Total</h2>
          <p className="text-3xl font-bold">$180,000</p>
        </div>
      </div>
      <div className="mt-4 flex justify-around">
        <button className="bg-blue-500 text-white py-2 px-4 rounded">Rutas</button>
        <button className="bg-green-500 text-white py-2 px-4 rounded">Préstamos</button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded">Cobradores</button>
      </div>
    </div>
  )
}

