import React from "react"

interface RoleSelectionScreenProps {
  onSelectRole: (role: "admin" | "collector") => void
}

export function RoleSelectionScreen({ onSelectRole }: RoleSelectionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6">Bienvenido a Paga-Fácil</h1>
      <p className="text-lg mb-4">Seleccione su rol:</p>
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4" onClick={() => onSelectRole("admin")}>
        Administrador
      </button>
      <button className="w-full bg-green-500 text-white py-2 px-4 rounded" onClick={() => onSelectRole("collector")}>
        Cobrador
      </button>
    </div>
  )
}

