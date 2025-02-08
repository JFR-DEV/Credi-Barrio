import { Suspense } from "react"
import AdminDashboardContent from "@/components/AdminDashboardContent"

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}

