import { RegisterForm } from "@/components/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

