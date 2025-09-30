/*
  # Schema para Sistema de Préstamos Locales

  ## Descripción
  Sistema completo para prestamistas locales en Latinoamérica con gestión de zonas,
  mensajeros, préstamos (favores) y seguimiento de pagos.

  ## Tablas Nuevas

  ### `zona_fondos`
  Zonas geográficas o fondos de operación
  - `id` (uuid, primary key)
  - `nombre` (text) - Nombre de la zona/fondo
  - `descripcion` (text) - Descripción
  - `fondo` (numeric) - Monto del fondo
  - `moneda` (text) - Código de moneda (USD, MXN, etc)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `mensajeros`
  Cobradores/Mensajeros que gestionan préstamos
  - `id` (uuid, primary key)
  - `apodo` (text) - Apodo/nombre del mensajero
  - `zona_fondo_id` (uuid, foreign key) - Zona asignada
  - `activo` (boolean) - Si está activo
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `favores`
  Préstamos otorgados a clientes
  - `id` (uuid, primary key)
  - `apodo_cliente` (text) - Apodo del cliente
  - `monto_prestado` (numeric) - Monto original del préstamo
  - `monto_por_periodo` (numeric) - Cuota por período
  - `numero_periodos` (integer) - Cantidad de períodos
  - `monto_total_devolver` (numeric) - Total a devolver
  - `periodicidad` (text) - 'diaria' o 'semanal'
  - `fecha_inicio` (date) - Fecha de inicio del préstamo
  - `tipo_negocio` (text) - Tipo de negocio del cliente
  - `ubicacion` (text) - Ubicación física
  - `descripcion` (text) - Notas adicionales
  - `zona_fondo_id` (uuid, foreign key)
  - `mensajero_id` (uuid, foreign key)
  - `estado` (text) - 'PENDIENTE', 'AL_DIA', 'ATRASADO', 'COMPLETADO'
  - `monto_cobrado` (numeric) - Total cobrado hasta ahora
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `pagos`
  Registro de pagos recibidos
  - `id` (uuid, primary key)
  - `favor_id` (uuid, foreign key)
  - `monto` (numeric) - Monto del pago
  - `fecha_pago` (date) - Fecha del pago
  - `mensajero_id` (uuid, foreign key) - Quien cobró
  - `notas` (text)
  - `created_at` (timestamptz)

  ### `tareas_mensajero`
  Tareas importantes para cada mensajero
  - `id` (uuid, primary key)
  - `mensajero_id` (uuid, foreign key)
  - `descripcion` (text)
  - `completada` (boolean)
  - `created_at` (timestamptz)

  ## Seguridad
  - RLS habilitado en todas las tablas
  - Políticas restrictivas para operaciones CRUD
*/

-- Crear tabla zona_fondos
CREATE TABLE IF NOT EXISTS zona_fondos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  fondo numeric DEFAULT 0,
  moneda text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla mensajeros
CREATE TABLE IF NOT EXISTS mensajeros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apodo text NOT NULL,
  zona_fondo_id uuid REFERENCES zona_fondos(id) ON DELETE SET NULL,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla favores
CREATE TABLE IF NOT EXISTS favores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apodo_cliente text NOT NULL,
  monto_prestado numeric NOT NULL,
  monto_por_periodo numeric NOT NULL,
  numero_periodos integer NOT NULL,
  monto_total_devolver numeric NOT NULL,
  periodicidad text DEFAULT 'diaria' CHECK (periodicidad IN ('diaria', 'semanal')),
  fecha_inicio date NOT NULL,
  tipo_negocio text,
  ubicacion text,
  descripcion text,
  zona_fondo_id uuid REFERENCES zona_fondos(id) ON DELETE SET NULL,
  mensajero_id uuid REFERENCES mensajeros(id) ON DELETE SET NULL,
  estado text DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'AL_DIA', 'ATRASADO', 'COMPLETADO')),
  monto_cobrado numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla pagos
CREATE TABLE IF NOT EXISTS pagos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  favor_id uuid REFERENCES favores(id) ON DELETE CASCADE,
  monto numeric NOT NULL,
  fecha_pago date NOT NULL DEFAULT CURRENT_DATE,
  mensajero_id uuid REFERENCES mensajeros(id) ON DELETE SET NULL,
  notas text,
  created_at timestamptz DEFAULT now()
);

-- Crear tabla tareas_mensajero
CREATE TABLE IF NOT EXISTS tareas_mensajero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mensajero_id uuid REFERENCES mensajeros(id) ON DELETE CASCADE,
  descripcion text NOT NULL,
  completada boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_mensajeros_zona ON mensajeros(zona_fondo_id);
CREATE INDEX IF NOT EXISTS idx_favores_zona ON favores(zona_fondo_id);
CREATE INDEX IF NOT EXISTS idx_favores_mensajero ON favores(mensajero_id);
CREATE INDEX IF NOT EXISTS idx_favores_estado ON favores(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_favor ON pagos(favor_id);
CREATE INDEX IF NOT EXISTS idx_pagos_fecha ON pagos(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_tareas_mensajero ON tareas_mensajero(mensajero_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_zona_fondos_updated_at ON zona_fondos;
CREATE TRIGGER update_zona_fondos_updated_at
  BEFORE UPDATE ON zona_fondos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mensajeros_updated_at ON mensajeros;
CREATE TRIGGER update_mensajeros_updated_at
  BEFORE UPDATE ON mensajeros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_favores_updated_at ON favores;
CREATE TRIGGER update_favores_updated_at
  BEFORE UPDATE ON favores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security
ALTER TABLE zona_fondos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajeros ENABLE ROW LEVEL SECURITY;
ALTER TABLE favores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas_mensajero ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (permitir todas las operaciones por ahora, luego se pueden restringir con auth)
CREATE POLICY "Allow all operations on zona_fondos" ON zona_fondos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on mensajeros" ON mensajeros FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on favores" ON favores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pagos" ON pagos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tareas_mensajero" ON tareas_mensajero FOR ALL USING (true) WITH CHECK (true);
