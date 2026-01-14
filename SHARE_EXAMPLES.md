/**
 * EJEMPLO DE USO: ShareService en DocumentList
 * 
 * Este archivo muestra cómo integrar ShareService de forma más limpia
 * en el componente DocumentList. Puede ser usado como referencia.
 */

// En DocumentList.js, importar:
import { ShareService } from '../../utils/ShareService.js';

// Luego, en el event listener del botón "Compartir", usar:
// ============================================================

container.querySelectorAll('.share-invoice').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const id = btn.getAttribute('data-id');
    
    // Mostrar indicador de carga
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="animate-spin inline-block">⏳</span> Preparando...';
    btn.disabled = true;
    
    try {
      const docRef = doc(db, 'invoices', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const invoice = { id: docSnap.id, ...docSnap.data() };
        const pdf = DocumentPDF.generateInvoicePDF(invoice);
        const pdfBlob = pdf.output('blob');
        const fileName = `factura_${invoice.number}.pdf`;
        
        // Usar ShareService para compartir
        const success = await ShareService.shareInvoice(invoice, pdfBlob, fileName);
        
        if (success) {
          console.log('Factura compartida exitosamente');
        }
      }
    } catch (error) {
      console.error('Error al compartir:', error);
      Toast.showError('❌ Error al preparar la factura para compartir');
    } finally {
      // Restaurar botón
      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }
  });
});

// ============================================================
// EJEMPLOS ADICIONALES DE USO
// ============================================================

/**
 * Ejemplo 1: Obtener URL de WhatsApp para copiar al portapapeles
 */
async function copyWhatsAppLink(invoice) {
  const url = ShareService.getWhatsAppURL(invoice);
  const success = await copyToClipboard(url);
  if (success) {
    Toast.show('✅ Enlace de WhatsApp copiado al portapapeles');
  }
}

/**
 * Ejemplo 2: Compartir a un número específico
 */
function sendToWhatsAppNumber(invoice, phoneNumber) {
  // phoneNumber debe incluir código de país: "+18095551234"
  ShareService.shareToWhatsAppNumber(invoice, phoneNumber);
}

/**
 * Ejemplo 3: Crear un mensaje formateado para compartir en otras redes
 */
function getShareMessage(invoice) {
  return ShareService.formatShareMessage(invoice);
}

/**
 * Ejemplo 4: Verificar capacidades del navegador
 */
function checkBrowserCapabilities() {
  const capabilities = ShareService.getShareCapabilities();
  console.log('Capacidades del navegador:', capabilities);
  
  if (capabilities.supportsWebShare) {
    console.log('✅ Este navegador soporta Web Share API');
  } else {
    console.log('⚠️ Este navegador usará fallback a WhatsApp Web');
  }
}
