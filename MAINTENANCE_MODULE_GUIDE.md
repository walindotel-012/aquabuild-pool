# Módulo de Cobro de Mantenimientos

## 📋 Descripción General

El módulo **"Cobro de Mantenimientos"** es un sistema completo para gestionar servicios de mantenimiento recurrentes. Permite:

1. **Asignar servicios de mantenimiento** a clientes
2. **Generar automáticamente facturas mensuales** basadas en las asignaciones
3. **Gestionar facturas** con opciones de editar, eliminar, marcar como pagadas
4. **Filtrar por mes** (mes actual por defecto)
5. **Compartir por WhatsApp** las facturas a clientes
6. **Descargar PDF** de las facturas

---

## 🎯 Características Principales

### 1. Asignación de Servicios

#### Ubicación: Pestaña "Asignaciones"

- **Botón**: "Asignar Servicio"
- **Formulario campos**:
  - Cliente (dropdown - relación con tabla de clientes)
  - Nombre del Servicio
  - Descripción
  - Monto (RD$)
  - Frecuencia de Facturación:
    - Mensual
    - Trimestral
    - Anual
  - Fecha de Inicio del Servicio
  - Estado (Activo/Inactivo)

#### Funcionalidades de Asignaciones:
- ✅ Crear nueva asignación
- ✏️ Editar asignación existente
- 🗑️ Eliminar asignación
- Ver lista de todas las asignaciones activas e inactivas

---

### 2. Generación Automática de Facturas

#### Botón: "Generar Facturas del Mes"

- Genera automáticamente facturas para TODAS las asignaciones activas
- Evita duplicados (una factura por asignación por mes)
- Formato de factura: **MTN-XXXXX** (MTN = Mantenimiento)
- Fecha de vencimiento: 15 días después de la generación

**Lógica Inteligente**:
- Solo genera facturas si la fecha de inicio es anterior o igual a hoy
- Respeta la frecuencia configurada en cada asignación
- Valida que no existan duplicados en el mismo mes

---

### 3. Gestión de Facturas del Mes

#### Ubicación: Pestaña "Facturas del Mes"

**Características**:
- 📅 Filtro por mes (mes actual por defecto)
- Navegación mes anterior/siguiente
- Selector de fecha rápida

**Información mostrada**:
- Cliente
- Número de factura (MTN-XXXXX)
- Servicio
- Monto
- Fecha de generación
- Fecha de vencimiento
- Estado (Pendiente/Pagada)

---

### 4. Acciones sobre Facturas

#### Para cada factura:

1. **✏️ Editar**
   - Modifica los datos de la factura
   - Afecta solo esa factura específica

2. **📄 Descargar PDF**
   - Genera PDF profesional
   - Formato similar a facturas regulares
   - Incluye todos los datos del cliente y servicio

3. **💬 Compartir por WhatsApp**
   - Abre WhatsApp Web o app
   - Mensaje preformato con:
     - Número de factura
     - Monto
     - Fecha de generación
     - Fecha de vencimiento
     - Servicio realizado
   - Se envía al número de teléfono del cliente

4. **✅ Marcar como Pagada**
   - Cambia estado de "Pendiente" a "Pagada"
   - Indicador visual en la tarjeta
   - Botón deshabilitado si ya está pagada

5. **🗑️ Eliminar**
   - Elimina la factura
   - Con confirmación
   - No afecta la asignación (puede regenerarse)

---

## 🗄️ Base de Datos - Colecciones Firebase

### Colección: `maintenanceAssignments`

```javascript
{
  id: "auto-generated",
  clientId: "client-id",
  clientName: "Nombre del Cliente",
  clientPhone: "809-XXX-XXXX",
  clientAddress: "Dirección",
  serviceName: "Nombre del Servicio",
  description: "Descripción detallada",
  amount: 1500.00,
  frequency: "monthly" | "quarterly" | "annual",
  startDate: "2024-01-15T00:00:00.000Z",
  isActive: true,
  createdAt: "2024-01-15T00:00:00.000Z",
  updatedAt: "2024-01-20T00:00:00.000Z"
}
```

### Colección: `maintenanceInvoices`

```javascript
{
  id: "auto-generated",
  number: "MTN-30100",
  clientId: "client-id",
  clientName: "Nombre del Cliente",
  clientPhone: "809-XXX-XXXX",
  clientAddress: "Dirección",
  assignmentId: "assignment-id",
  serviceName: "Nombre del Servicio",
  amount: 1500.00,
  generatedDate: "2024-01-15T00:00:00.000Z",
  dueDate: "2024-01-30T00:00:00.000Z",
  isPaid: false,
  createdAt: "2024-01-15T00:00:00.000Z",
  updatedAt: "2024-01-20T00:00:00.000Z"
}
```

---

## 🔧 Servicios Disponibles

### `MaintenanceAssignmentService`

```javascript
// Obtener todas las asignaciones
await MaintenanceAssignmentService.getAll()

// Obtener asignaciones de un cliente
await MaintenanceAssignmentService.getByClientId(clientId)

// Crear asignación
await MaintenanceAssignmentService.create(assignmentData)

// Actualizar asignación
await MaintenanceAssignmentService.update(id, assignmentData)

// Eliminar asignación
await MaintenanceAssignmentService.delete(id)
```

### `MaintenanceInvoiceService`

```javascript
// Obtener todas las facturas
await MaintenanceInvoiceService.getAll()

// Obtener facturas de un mes específico
await MaintenanceInvoiceService.getByMonth(year, month)

// Obtener facturas de un cliente en un mes
await MaintenanceInvoiceService.getByClientIdAndMonth(clientId, year, month)

// Crear factura
await MaintenanceInvoiceService.create(invoiceData)

// Actualizar factura
await MaintenanceInvoiceService.update(id, invoiceData)

// Eliminar factura
await MaintenanceInvoiceService.delete(id)

// Generar automáticamente facturas mensuales
await MaintenanceInvoiceService.generateMonthlyInvoices()
```

---

## 📱 Flujo de Usuario

### Proceso Típico:

1. **Crear Asignación**
   - Click en "Asignar Servicio"
   - Llenar datos del formulario
   - Guardar

2. **Generar Facturas**
   - Ir a pestaña "Facturas del Mes"
   - Click en "Generar Facturas del Mes"
   - El sistema crea automáticamente todas las facturas

3. **Gestionar Facturas**
   - Editar detalles si es necesario
   - Compartir con cliente por WhatsApp
   - Descargar PDF para archivo
   - Marcar como pagada cuando se reciba el pago

4. **Seguimiento Mensual**
   - Usar filtro de mes para navegar
   - Identificar facturas pendientes
   - Dar seguimiento a pagos

---

## 🎨 Interfaz de Usuario

### Componentes Principales:

1. **Header del Módulo**
   - Título: "Cobro de Mantenimientos"
   - Descripción
   - Botón "Asignar Servicio"

2. **Sistema de Pestañas**
   - Asignaciones (servicios configurados)
   - Facturas del Mes (facturas generadas)

3. **Tarjetas de Asignación**
   - Cliente
   - Servicio
   - Monto
   - Frecuencia
   - Fecha de inicio
   - Estado (Activo/Inactivo)
   - Botones de acción

4. **Tarjetas de Factura**
   - Cliente
   - Número de factura
   - Servicio
   - Monto
   - Fecha de generación y vencimiento
   - Estado de pago
   - Botones de acción

5. **Controles de Filtro**
   - Selector de mes
   - Botones anterior/siguiente
   - Botón generar facturas

---

## 🚀 Cómo Usar

### Acceder al Módulo:
1. En el menú principal, click en "Mantenimientos"
2. O navegar a `#maintenance`

### Crear Primera Asignación:
1. Click en "Asignar Servicio"
2. Seleccionar cliente del dropdown
3. Ingresar datos del servicio
4. Seleccionar frecuencia
5. Establecer fecha de inicio
6. Click en "Guardar Asignación"

### Generar Facturas:
1. Ir a pestaña "Facturas del Mes"
2. El mes actual se muestra por defecto
3. Click en "Generar Facturas del Mes"
4. El sistema muestra cuántas se generaron

### Compartir Factura:
1. Localizar la factura en el listado
2. Click en botón "WhatsApp"
3. Se abre WhatsApp con mensaje preformateado
4. Enviar al cliente

---

## 📊 Números de Factura

- **Formato**: `MTN-XXXXX`
- **Rango**: Comienza en `MTN-30100`
- **Secuencial**: Incrementa con cada nueva factura
- **Prefijo**: MTN = Mantenimiento (diferenciado de FAC para facturas regulares)

---

## ⚙️ Configuración Técnica

### Archivos Creados:

1. **Servicios de Datos**:
   - `src/data/firebaseService.js` - Servicios MaintenanceAssignmentService y MaintenanceInvoiceService

2. **Componentes**:
   - `src/components/maintenance/MaintenanceAssignmentForm.js` - Formulario de asignación
   - `src/components/maintenance/MaintenanceList.js` - Lista de facturas

3. **Páginas**:
   - `src/pages/MaintenancePage.js` - Página principal del módulo

4. **Integraciones**:
   - Actualizado `src/app.js` - Ruta de navegación
   - Actualizado `src/components/layout/Header.js` - Opción en menú

---

## 🔐 Seguridad

- Las asignaciones se vinculan con clientes existentes
- Los datos se validan antes de guardar
- Las facturas se vinculan con asignaciones
- Se previenen duplicados automáticamente

---

## 📈 Casos de Uso

1. **Empresa de Mantenimiento de Piscinas**
   - Servicios mensuales de limpieza
   - Mantenimiento trimestral de equipos
   - Limpieza anual profunda

2. **Servicios de Seguridad**
   - Patrullaje mensual
   - Inspección trimestral
   - Mantenimiento anual de sistemas

3. **Servicios de Limpieza**
   - Limpieza semanal, mensual o trimestral
   - Diferentes tarifi por cada cliente

---

## 🎁 Próximas Mejoras Posibles

- [ ] Reportes de facturas pendientes
- [ ] Automatización de recordatorios
- [ ] Historial de pagos por cliente
- [ ] Generar reportes por período
- [ ] Exportar a Excel/CSV
- [ ] Integración con pasarela de pagos
- [ ] Recordatorios automáticos antes de vencer

---

**Versión**: 1.0
**Última actualización**: Enero 2024
**Estado**: Producción
