import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ZonaFondo = {
  id: string
  nombre: string
  descripcion: string | null
  fondo: number
  moneda: string
  created_at: string
  updated_at: string
}

export type Mensajero = {
  id: string
  apodo: string
  zona_fondo_id: string | null
  activo: boolean
  created_at: string
  updated_at: string
}

export type Favor = {
  id: string
  apodo_cliente: string
  monto_prestado: number
  monto_por_periodo: number
  numero_periodos: number
  monto_total_devolver: number
  periodicidad: 'diaria' | 'semanal'
  fecha_inicio: string
  tipo_negocio: string | null
  ubicacion: string | null
  descripcion: string | null
  zona_fondo_id: string | null
  mensajero_id: string | null
  estado: 'PENDIENTE' | 'AL_DIA' | 'ATRASADO' | 'COMPLETADO'
  monto_cobrado: number
  created_at: string
  updated_at: string
}

export type Pago = {
  id: string
  favor_id: string
  monto: number
  fecha_pago: string
  mensajero_id: string | null
  notas: string | null
  created_at: string
}

export type TareaMensajero = {
  id: string
  mensajero_id: string
  descripcion: string
  completada: boolean
  created_at: string
}
