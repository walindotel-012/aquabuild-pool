┌───────────────────────────────────────────────────────────────────────────────┐
│                  📱 SISTEMA DE COMPARTICIÓN DE FACTURAS                        │
│                         AquaBuild Pool - WhatsApp                             │
└───────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                          ARQUITECTURA DEL SISTEMA                            │
└──────────────────────────────────────────────────────────────────────────────┘

                          ┌─────────────────────┐
                          │   Usuario Final     │
                          └──────────┬──────────┘
                                     │
                      ┌──────────────┴──────────────┐
                      │                             │
                  ┌───▼────────┐          ┌────────▼────┐
                  │ Dispositivo│          │   Desktop   │
                  │  Móvil     │          │  Browser    │
                  └───┬────────┘          └────────┬────┘
                      │                             │
         ┌────────────┴──────────────┐   ┌────────┴─────────────┐
         │                           │   │                      │
    ┌────▼─────────┐         ┌───────▼──┴────────┐          ┌──▼──────┐
    │  Web Share   │         │  WhatsApp Web API │          │ WhatsApp│
    │  API Native  │         │  (Fallback)       │          │ Desktop │
    └────┬─────────┘         └────┬──────────────┘          └──┬──────┘
         │                        │                             │
         └────────┬───────────────┴─────────────────────────────┘
                  │
         ┌────────▼────────────┐
         │  Sistema de Chat:   │
         │  WhatsApp           │
         └────────┬────────────┘
                  │
         ┌────────▼────────────┐
         │  Contacto del       │
         │  Usuario            │
         └─────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                        ESTRUCTURA DE ARCHIVOS                                │
└──────────────────────────────────────────────────────────────────────────────┘

aquabuild-pool/
├── src/
│   ├── components/
│   │   └── documents/
│   │       ├── DocumentList.js          ✅ [MODIFICADO]
│   │       │   ├── Importa ShareService
│   │       │   ├── shareViaWhatsApp()
│   │       │   └── Event listener .share-invoice
│   │       │
│   │       ├── DocumentPDF.js            (sin cambios)
│   │       ├── DocumentForm.js           (sin cambios)
│   │       └── DocumentDetailModal.js    (sin cambios)
│   │
│   └── utils/
│       ├── helpers.js                    ✅ [MODIFICADO]
│       │   ├── formatCurrencyRD()        (existente)
│       │   ├── formatDate()              (existente)
│       │   ├── isMobileDevice()          ✨ [NUEVO]
│       │   ├── copyToClipboard()         ✨ [NUEVO]
│       │   └── generateWhatsAppURL()     ✨ [NUEVO]
│       │
│       └── ShareService.js               ✨ [NUEVO]
│           ├── shareInvoice()
│           ├── shareViaWebShare()
│           ├── shareViaWhatsApp()
│           ├── shareToWhatsAppNumber()
│           ├── getWhatsAppURL()
│           ├── formatShareMessage()
│           ├── supportsWebShare()
│           └── getShareCapabilities()
│
├── SHARE_INVOICE_GUIDE.md                ✨ [NUEVO]
├── SHARE_EXAMPLES.md                     ✨ [NUEVO]
└── IMPLEMENTATION_SUMMARY.md             ✨ [NUEVO]


┌──────────────────────────────────────────────────────────────────────────────┐
│                          FLUJO DE EJECUCIÓN                                  │
└──────────────────────────────────────────────────────────────────────────────┘

PASO 1: USUARIO HACE CLIC EN BOTÓN "COMPARTIR"
─────────────────────────────────────────────────
┌─────────────────────────────────────┐
│ <button class="share-invoice">      │
│   📱 Compartir                       │
│ </button>                            │
└────────────┬────────────────────────┘
             │
             ▼
      Event Listener Activado
             │
             ▼


PASO 2: MOSTRAR INDICADOR DE CARGA
──────────────────────────────────────
┌──────────────────────────────────────┐
│ Botón: ⏳ Preparando...               │
│ Estado: disabled = true              │
└────────────┬─────────────────────────┘
             │
             ▼


PASO 3: OBTENER DATOS DE FIREBASE
────────────────────────────────────
┌──────────────────────────────────────┐
│ const docRef = doc(db, 'invoices', id)
│ const docSnap = await getDoc(docRef) │
│                                      │
│ ✅ Datos obtenidos                   │
└────────────┬─────────────────────────┘
             │
             ▼


PASO 4: GENERAR PDF EN MEMORIA
───────────────────────────────
┌──────────────────────────────────────┐
│ const pdf = DocumentPDF              │
│   .generateInvoicePDF(invoice)       │
│ const pdfBlob = pdf.output('blob')   │
│                                      │
│ ✅ PDF generado sin descargar        │
└────────────┬─────────────────────────┘
             │
             ▼


PASO 5: DETECTAR DISPOSITIVO Y NAVEGADOR
─────────────────────────────────────────
┌──────────────────────────────────────────────────┐
│ const isMobile = isMobileDevice()                │
│ const hasWebShare = navigator.share &&           │
│                    navigator.canShare            │
│                                                  │
│ Resultado:                                       │
│ • Móvil + Web Share API → Usar nativo            │
│ • Otro caso → Usar WhatsApp Web                  │
└────────────┬─────────────────────────────────────┘
             │
             ▼
     
     ┌──────────────────────────┐
     │  ¿Móvil + Web Share API? │
     └──────────┬───────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼ Sí            ▼ No
       
    ┌─────────┐      ┌─────────────┐
    │ Web     │      │ WhatsApp    │
    │ Share   │      │ Web/App     │
    │ API     │      └─────────────┘
    └────┬────┘             │
         │                  ▼
         │          window.open(waUrl, '_blank')
         │                  │
         └──────┬───────────┘
                │
                ▼


PASO 6: MOSTRAR MENSAJE AL USUARIO
───────────────────────────────────
┌──────────────────────────────────────┐
│ Toast.show('✅ ¡Factura compartida!') │
│        o                              │
│ Toast.show('📱 Abre WhatsApp...')     │
└─────────────────────────────────────┘


PASO 7: RESTAURAR ESTADO DEL BOTÓN
──────────────────────────────────
┌──────────────────────────────────────┐
│ btn.innerHTML = originalHTML          │
│ btn.disabled = false                  │
└──────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                    EJEMPLO DE MENSAJE ENVIADO                                │
└──────────────────────────────────────────────────────────────────────────────┘

📋 *Factura* #FAC-12345

*Cliente:* Juan Pérez
*Total:* RD$ 1,500.00
*Fecha:* 15/01/2026

¡Factura adjunta! Desde Piscinas Durán

[Archivo: factura_FAC-12345.pdf]


┌──────────────────────────────────────────────────────────────────────────────┐
│                         MATRIZ DE COMPATIBILIDAD                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┬──────────────┬──────────────┬───────────────┐
│ Navegador           │ Dispositivo  │ Web Share API│ Funcionamiento│
├─────────────────────┼──────────────┼──────────────┼───────────────┤
│ Chrome 61+          │ Android      │ ✅ Sí        │ ⭐⭐⭐⭐⭐      │
│ Firefox 71+         │ Android      │ 🟡 Parcial   │ ⭐⭐⭐⭐       │
│ Safari iOS 13.1+    │ iPhone/iPad  │ ✅ Sí        │ ⭐⭐⭐⭐⭐      │
│ Samsung Internet    │ Android      │ ✅ Sí        │ ⭐⭐⭐⭐⭐      │
│ Chrome 60-          │ Android      │ ❌ No        │ ⭐⭐⭐⭐       │
│ Firefox 50-70       │ Android      │ ❌ No        │ ⭐⭐⭐⭐       │
│ Safari iOS <13.1    │ iPhone/iPad  │ ❌ No        │ ⭐⭐⭐⭐       │
├─────────────────────┼──────────────┼──────────────┼───────────────┤
│ Chrome             │ Windows/Mac  │ ❌ No        │ ⭐⭐⭐⭐       │
│ Firefox            │ Windows/Mac  │ ❌ No        │ ⭐⭐⭐⭐       │
│ Safari             │ macOS        │ ❌ No        │ ⭐⭐⭐⭐       │
│ Edge               │ Windows      │ ❌ No        │ ⭐⭐⭐⭐       │
│ Internet Explorer  │ Windows      │ ❌ No        │ ⭐⭐⭐         │
└─────────────────────┴──────────────┴──────────────┴───────────────┘

Nota: Todos requieren tener WhatsApp instalado o abierto para usar.


┌──────────────────────────────────────────────────────────────────────────────┐
│                      MANEJO DE ERRORES                                       │
└──────────────────────────────────────────────────────────────────────────────┘

├─ Error al generar PDF
│  └─ Toast: "❌ Error al preparar la factura"
│
├─ Usuario cancela Web Share API
│  └─ Fallback automático a WhatsApp
│
├─ Error al obtener datos de Firebase
│  └─ Toast: "❌ Error al preparar la factura"
│
├─ WhatsApp no instalado/abierto (móvil)
│  └─ Abre App Store o Play Store para instalar
│
├─ WhatsApp Web no abierto (desktop)
│  └─ Muestra instructivo para abrir WhatsApp Web
│
└─ Navegador muy antiguo
   └─ Fallback a descarga de PDF


┌──────────────────────────────────────────────────────────────────────────────┐
│                    ESTADÍSTICAS Y MÉTRICAS                                   │
└──────────────────────────────────────────────────────────────────────────────┘

Para rastrear:
✓ Cantidad de facturas compartidas por día/mes
✓ Canal de compartición usado (Web Share, WhatsApp Web, etc.)
✓ Dispositivo que hizo el compartimiento
✓ Tasa de éxito/error
✓ Tiempo promedio para compartir
✓ Distribución de contactos destinatarios

Implementar agregando:
// En event listener
const shareEvent = {
  invoiceId: invoice.id,
  timestamp: new Date(),
  device: isMobileDevice() ? 'mobile' : 'desktop',
  method: canUseNativeShare ? 'web-share' : 'whatsapp-web',
  success: true
};
// Guardar en Firebase Analytics
