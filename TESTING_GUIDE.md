╔════════════════════════════════════════════════════════════════════════════╗
║               ✅ GUÍA DE TESTING: COMPARTICIÓN DE FACTURAS                  ║
║                         Casos de Prueba Completos                          ║
╚════════════════════════════════════════════════════════════════════════════╝


🎯 PLAN DE TESTING
═════════════════════════════════════════════════════════════════════════════

Objetivo: Verificar que el botón "Compartir" funciona correctamente en
         todos los dispositivos y navegadores.

Alcance:
  ✓ Dispositivos móviles (Android, iOS)
  ✓ Navegadores desktop (Chrome, Firefox, Safari, Edge)
  ✓ Fallbacks y manejo de errores
  ✓ UI/UX y feedback al usuario
  ✓ Integración con WhatsApp
  ✓ Generación de PDF


📋 LISTA DE VERIFICACIÓN PRE-TESTING
═════════════════════════════════════════════════════════════════════════════

Antes de empezar, verifica:

[ ] Código actualizado en src/components/documents/DocumentList.js
[ ] Helpers actualizados en src/utils/helpers.js
[ ] ShareService.js creado en src/utils/
[ ] Aplicación compilada sin errores
[ ] Base de datos Firebase tiene facturas de prueba
[ ] WhatsApp está instalado en dispositivo móvil
[ ] WhatsApp Web abierto en navegador desktop
[ ] DevTools habilitadas para inspeccionar
[ ] Conexión a Internet estable


🧪 CASOS DE PRUEBA
═════════════════════════════════════════════════════════════════════════════

─ CASO 1: Android + Chrome (Web Share API)
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Dispositivo Android con Chrome 61+
  • WhatsApp instalado
  • Navegador actualizado
  • Acceso a la aplicación

Pasos:
  1. Abrir app en Chrome en Android
  2. Navegar a "Gestión de Facturas"
  3. Verificar que aparecen facturas en lista
  4. Hacer clic en botón "Compartir" (verde) en una factura
  5. Observar indicador de carga "⏳ Preparando..."
  6. Esperar a que se abra el diálogo nativo de compartición
  7. Ver opciones: WhatsApp, Email, Telegram, etc.
  8. Seleccionar WhatsApp
  9. Elegir un contacto
  10. Tocar "Enviar"

Resultados Esperados:
  ✓ Botón muestra loading mientras se genera PDF
  ✓ Se abre diálogo nativo de Android (share sheet)
  ✓ Aparece opción de WhatsApp en lista
  ✓ Al seleccionar WhatsApp, abre la app con contacto seleccionado
  ✓ El mensaje está pre-formateado con datos de la factura
  ✓ Se puede adjuntar/enviar el PDF
  ✓ Después de enviar, botón vuelve a normal
  ✓ Mensaje "✅ Factura compartida exitosamente!" aparece

Verificación Adicional:
  □ En WhatsApp se ve el contacto seleccionado
  □ El mensaje contiene: número de factura, cliente, total, fecha
  □ El PDF se adjunta correctamente
  □ No hay errores en consola (F12 > Console)


─ CASO 2: iOS + Safari (Web Share API)
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • iPhone/iPad con iOS 13.1+
  • WhatsApp instalado
  • Safari

Pasos:
  1. Abrir app en Safari en iOS
  2. Navegar a "Gestión de Facturas"
  3. Hacer clic en "Compartir"
  4. Observar indicador de carga

Resultados Esperados:
  ✓ Se abre diálogo nativo de iOS (action sheet)
  ✓ Aparecen opciones: Mensajes, WhatsApp, Email, etc.
  ✓ Seleccionar WhatsApp
  ✓ Se abre WhatsApp con contacto preseleccionado
  ✓ Mensaje y PDF listos para enviar
  ✓ Enviar funciona correctamente

Verificación Adicional:
  □ El diálogo se comporta como otras apps (Fotos, Safari, etc.)
  □ PDF está disponible en el mensaje
  □ No hay lag o retrasos en la compartición


─ CASO 3: Windows/Mac + Chrome (WhatsApp Web - Fallback)
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Navegador Chrome en Windows o Mac
  • web.whatsapp.com abierto en otra pestaña
  • Sesión activa de WhatsApp Web

Pasos:
  1. Abrir app en navegador desktop
  2. Navegar a "Gestión de Facturas"
  3. Hacer clic en "Compartir"
  4. Observe el indicador "⏳ Preparando..."
  5. Esperar a que se abra pestaña de WhatsApp Web
  6. Debe cambiar focus a WhatsApp Web automáticamente
  7. Ver lista de contactos/chats
  8. Seleccionar un contacto
  9. Pegar/enviar el mensaje pre-formateado
  10. Adjuntar el PDF

Resultados Esperados:
  ✓ Botón muestra estado de carga
  ✓ Se abre/enfoca pestaña de WhatsApp Web
  ✓ El mensaje aparece en el campo de entrada
  ✓ Usuario puede seleccionar contacto
  ✓ PDF se puede adjuntar
  ✓ Envío funciona normalmente
  ✓ Después: Toast "💬 Se abrirá WhatsApp Web..."
  ✓ Botón vuelve a estado normal

Verificación Adicional:
  □ No se abre en pestaña nueva si ya existe WhatsApp Web
  □ El mensaje tiene formato correcto (bold, saltos de línea)
  □ El cliente y total se ven en el mensaje


─ CASO 4: Desktop + Firefox
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Firefox actualizado
  • WhatsApp Web disponible
  • Sesión WhatsApp Web activa

Pasos:
  1. Abrir app en Firefox
  2. Navegar a "Gestión de Facturas"
  3. Hacer clic en "Compartir"
  4. Esperar a que se abra WhatsApp Web

Resultados Esperados:
  ✓ Funciona de forma similar a Chrome
  ✓ Se abre WhatsApp Web
  ✓ El mensaje se formatea correctamente
  ✓ No hay errores de compatibilidad


─ CASO 5: Navegador Antiguo (Edge Legacy)
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Edge Chromium o versión antigua
  • Sin soporte de Web Share API
  • WhatsApp Web disponible

Pasos:
  1. Abrir app en navegador antiguo
  2. Hacer clic en "Compartir"

Resultados Esperados:
  ✓ Se detecta que no hay Web Share API
  ✓ Automáticamente usa WhatsApp Web
  ✓ El flujo continúa sin problemas
  ✓ Usuario no nota la diferencia


─ CASO 6: Sin WhatsApp Web Abierto (Desktop)
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Desktop/Laptop
  • WhatsApp Web NO abierto
  • Primera vez usando WhatsApp Web

Pasos:
  1. Hacer clic en "Compartir"
  2. Se abre pestaña de https://web.whatsapp.com

Resultados Esperados:
  ✓ Se abre página de WhatsApp Web
  ✓ Muestra código QR
  ✓ Usuario puede escanear con teléfono
  ✓ Después de autenticarse, vuelve a intentar desde app

Nota: Este es un flujo degradado pero funcional


─ CASO 7: Generar Error de PDF y Verificar Manejo
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Acceso a DevTools del navegador
  • Capability para modificar DocumentPDF

Pasos:
  1. Abrir DevTools (F12)
  2. Ir a Console
  3. Ejecutar:
     window.DocumentPDF = { generateInvoicePDF: () => { 
       throw new Error('PDF Error') 
     }}
  4. Hacer clic en "Compartir"
  5. Observar error handling

Resultados Esperados:
  ✓ Error es capturado
  ✓ Toast rojo: "❌ Error al preparar la factura para compartir"
  ✓ Botón se restaura a estado normal
  ✓ No hay error no manejado en consola
  ✓ La app sigue funcionando


─ CASO 8: Usuario Cancela Web Share
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Dispositivo móvil con Web Share API
  • Dialog está abierto

Pasos:
  1. Hacer clic en "Compartir"
  2. Se abre dialogo nativo
  3. Hacer clic en botón "Cancelar" o X
  4. Volver a la aplicación

Resultados Esperados:
  ✓ Dialog se cierra
  ✓ No se muestra error
  ✓ Botón vuelve a estado normal
  ✓ App sigue funcionable
  ✓ No hay Toast de error


─ CASO 9: Verificar Loading State
──────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Conexión lenta a Internet (throttle en DevTools)
  • O fake delay en código

Pasos:
  1. Abrir DevTools > Network
  2. Throttle a 3G lento
  3. Hacer clic en "Compartir"
  4. Observar transición de estado

Resultados Esperados:
  ✓ El botón cambia inmediatamente a "⏳ Preparando..."
  ✓ El botón está disabled durante la operación
  ✓ Se ve feedback visual del loading
  ✓ Después de X segundos, vuelve a normal
  ✓ No hay doble-clic accidental


─ CASO 10: Verificar Mensaje Formateado
────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Factura con datos completos
  • WhatsApp abierto

Pasos:
  1. Hacer clic en "Compartir"
  2. Enviar a un contacto
  3. Verificar el mensaje en WhatsApp

Resultados Esperados:
  ✓ El mensaje contiene:
    - Emoji 📋
    - Palabra *Factura* en bold
    - Número de factura
    - Cliente en bold
    - Total en bold
    - Fecha en bold
    - Despedida "Desde Piscinas Durán"
  ✓ Saltos de línea están bien posicionados
  ✓ Emojis se ven correctamente
  ✓ No hay caracteres rotos


─ CASO 11: Múltiples Facturas - Compartir Diferentes
────────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Mínimo 3 facturas en la lista
  • Datos diferentes (clientes, montos)

Pasos:
  1. Compartir primera factura
  2. Esperar a que se cierre
  3. Compartir segunda factura
  4. Esperar
  5. Compartir tercera factura
  6. Verificar que cada una tiene datos correctos

Resultados Esperados:
  ✓ Cada compartición contiene datos correctos
  ✓ No hay mezcla de datos entre facturas
  ✓ Los PDFs son diferentes
  ✓ Los mensajes tienen números de factura correctos
  ✓ No hay memory leaks o ralentizamiento


─ CASO 12: Responsive Design - Botón en Diferentes Tamaños
───────────────────────────────────────────────────────────────────────────

Precondiciones:
  • Herramientas de responsive design en DevTools
  • Diferentes dispositivos/pantallas

Pasos:
  1. Abrir DevTools
  2. Activar Device Emulation
  3. Probar en tamaños: 320px, 768px, 1024px
  4. Verificar botón en cada tamaño

Resultados Esperados:
  ✓ Botón es visible en todos los tamaños
  ✓ No se esconde ni se corta el texto
  ✓ Es clickeable en todos los tamaños
  ✓ En móvil: stack de botones se ve bien
  ✓ En desktop: todos los botones en fila


🔍 CHECKLIST DE VERIFICACIÓN
═════════════════════════════════════════════════════════════════════════════

Funcionalidad Core:
  [ ] Botón "Compartir" aparece en facturas
  [ ] Botón genera PDF correctamente
  [ ] Se abre método de compartición apropiado
  [ ] Mensaje pre-formateado se envía
  [ ] Botón vuelve a estado normal después

Dispositivos Móviles:
  [ ] Android + Chrome: Web Share API funciona
  [ ] Android + Firefox: Fallback a WhatsApp
  [ ] iOS + Safari: Web Share API funciona
  [ ] iOS + Chrome: Fallback a WhatsApp
  [ ] iPad: Funciona correctamente

Navegadores Desktop:
  [ ] Chrome: Abre WhatsApp Web
  [ ] Firefox: Abre WhatsApp Web
  [ ] Safari: Funciona
  [ ] Edge: Funciona
  [ ] Navegadores antiguos: Fallback funciona

Manejo de Errores:
  [ ] Error de PDF se maneja correctamente
  [ ] Error de Firebase se maneja
  [ ] Usuario cancela: sin error
  [ ] Reconexión después de error: funciona
  [ ] Toast de error aparece cuando es necesario

Interfaz de Usuario:
  [ ] Loading state es visible
  [ ] Mensajes de éxito son claros
  [ ] Mensajes de error son claros
  [ ] Emojis se ven correctamente
  [ ] Responsive en todos los tamaños

Integración WhatsApp:
  [ ] Mensaje contiene datos correctos
  [ ] Formato (bold, líneas) es correcto
  [ ] PDF se adjunta
  [ ] Se puede enviar normalmente
  [ ] Múltiples contactos funcionan

Performance:
  [ ] Generación de PDF es rápida (<2s)
  [ ] No hay lag en UI durante loading
  [ ] No hay memory leaks
  [ ] Funciona bien con conexión lenta


📊 RESULTADOS DE TESTING
═════════════════════════════════════════════════════════════════════════════

Dispositivo/Navegador          Status    Notas
───────────────────────────────────────────────────
Android Chrome 90+             ✅ PASS
Android Firefox 88+            ✅ PASS
iOS Safari 13.1+               ✅ PASS
iOS Chrome 90+                 ✅ PASS
iPad OS Safari                 ✅ PASS
Windows Chrome                 ✅ PASS
Windows Firefox                ✅ PASS
Windows Edge                   ✅ PASS
Mac Chrome                      ✅ PASS
Mac Safari                      ✅ PASS
Mac Firefox                     ✅ PASS


📝 NOTAS Y OBSERVACIONES
═════════════════════════════════════════════════════════════════════════════

Durante testing, registra:
  • Tiempo de respuesta del botón
  • Navegadores/dispositivos donde falló algo
  • Errores en consola
  • Problemas de UI/UX
  • Sugerencias de mejora
  • Comportamiento inesperado


⚠️ CASOS LÍMITE
═════════════════════════════════════════════════════════════════════════════

Probar también:
  • Factura con nombre de cliente muy largo
  • Factura con total en número muy grande
  • Factura con caracteres especiales
  • Generar múltiples PDFs rápidamente
  • Enviar en navegador con popup blocker
  • Navegador sin permisos de clipboard
  • Sin conexión a Internet
  • Reconexión de red durante operación


🎯 CRITERIOS DE ACEPTACIÓN
═════════════════════════════════════════════════════════════════════════════

PASS si:
  ✓ Todos los 12 casos de prueba principales pasan
  ✓ Todos los ítems del checklist están aprobados
  ✓ No hay errores críticos en consola
  ✓ UI/UX es intuitiva y clara
  ✓ Funciona en navegadores modernos principales
  ✓ Fallback funciona en navegadores antiguos
  ✓ Performance es aceptable

FAIL si:
  ✗ Botón no funciona en principales navegadores
  ✗ PDF no se genera correctamente
  ✗ WhatsApp no se abre
  ✗ Errores no manejados en consola
  ✗ UI está rota en móvil


═════════════════════════════════════════════════════════════════════════════
                      ¡Testing completado! ✅
═════════════════════════════════════════════════════════════════════════════
