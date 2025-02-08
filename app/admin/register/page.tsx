import { AdminRegisterForm } from "@/components/AdminRegisterForm"

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro de Administrador</h1>
        <AdminRegisterForm />
      </div>
    </div>
  )
}

