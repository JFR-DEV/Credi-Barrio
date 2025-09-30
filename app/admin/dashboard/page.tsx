import { Suspense } from "react"
import AdminDashboardContentNew from "@/components/AdminDashboardContentNew"
import { Toaster } from "sonner"

export default function AdminDashboardPage() {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-slate-600">Cargando panel...</div>
        </div>
      }>
        <AdminDashboardContentNew />
      </Suspense>
      <Toaster position="top-right" richColors />
    </>
  )
}

