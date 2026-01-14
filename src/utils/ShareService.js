/**
 * ShareService.js
 * Servicio centralizado para gestionar la compartición de documentos
 * Proporciona métodos para compartir facturas, cotizaciones y otros documentos
 */

import { Toast } from '../components/ui/Toast.js';
import { formatCurrencyRD, formatDate, isMobileDevice, generateWhatsAppURL } from './helpers.js';

export class ShareService {
  /**
   * Comparte una factura usando Web Share API o WhatsApp
   * @param {Object} invoice - Datos de la factura
   * @param {Blob} pdfBlob - PDF generado
   * @param {string} fileName - Nombre del archivo PDF
   * @returns {Promise<boolean>}
   */
  static async shareInvoice(invoice, pdfBlob, fileName) {
    try {
      const canUseNativeShare = isMobileDevice() && navigator.share && navigator.canShare;

      if (canUseNativeShare) {
        return await this.shareViaWebShare(invoice, pdfBlob, fileName);
      } else {
        return await this.shareViaWhatsApp(invoice);
      }
    } catch (error) {
      console.error('Error al compartir factura:', error);
      Toast.showError('❌ Error al preparar la factura para compartir');
      return false;
    }
  }

  /**
   * Compartir usando Web Share API nativa del navegador
   * @private
   */
  static async shareViaWebShare(invoice, pdfBlob, fileName) {
    try {
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      const canShare = navigator.canShare({
        files: [file]
      });

      if (!canShare) {
        throw new Error('El navegador no soporta compartir archivos');
      }

      await navigator.share({
        title: `Factura #${invoice.number}`,
        text: `Factura de ${invoice.clientName} - Total: ${formatCurrencyRD(invoice.total)}`,
        files: [file]
      });

      Toast.show('✅ ¡Factura compartida exitosamente!');
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        // Usuario canceló el diálogo
        return false;
      }
      throw error;
    }
  }

  /**
   * Compartir vía WhatsApp Web/App
   * @private
   */
  static async shareViaWhatsApp(invoice) {
    try {
      const waUrl = generateWhatsAppURL(invoice);
      window.open(waUrl, '_blank');

      if (isMobileDevice()) {
        Toast.show('📱 Abre WhatsApp, selecciona un contacto y comparte la factura');
      } else {
        Toast.show('💬 Se abrirá WhatsApp Web - selecciona un contacto y envía el PDF');
      }
      return true;
    } catch (error) {
      console.error('Error al abrir WhatsApp:', error);
      Toast.showError('❌ No se pudo abrir WhatsApp');
      return false;
    }
  }

  /**
   * Compartir a un número específico de WhatsApp
   * @param {Object} invoice - Datos de la factura
   * @param {string} phoneNumber - Número de teléfono con código de país (ej: +18095551234)
   */
  static shareToWhatsAppNumber(invoice, phoneNumber) {
    try {
      const waUrl = generateWhatsAppURL(invoice, phoneNumber);
      window.open(waUrl, '_blank');
      Toast.show('✅ Abriendo WhatsApp...');
      return true;
    } catch (error) {
      console.error('Error al compartir a WhatsApp:', error);
      Toast.showError('❌ Error al abrir WhatsApp');
      return false;
    }
  }

  /**
   * Obtiene la URL de WhatsApp para una factura
   * @param {Object} invoice - Datos de la factura
   * @param {string} phoneNumber - Número opcional
   * @returns {string} URL completa de WhatsApp
   */
  static getWhatsAppURL(invoice, phoneNumber = null) {
    return generateWhatsAppURL(invoice, phoneNumber);
  }

  /**
   * Prepara un mensaje de compartición para redes sociales
   * @param {Object} invoice - Datos de la factura
   * @returns {string} Mensaje formateado
   */
  static formatShareMessage(invoice) {
    return `Factura #${invoice.number}\n` +
           `Cliente: ${invoice.clientName}\n` +
           `Total: ${formatCurrencyRD(invoice.total)}\n` +
           `Fecha: ${formatDate(invoice.date)}`;
  }

  /**
   * Verifica si el navegador soporta Web Share API
   * @returns {boolean}
   */
  static supportsWebShare() {
    return isMobileDevice() && navigator.share && navigator.canShare;
  }

  /**
   * Obtiene información sobre el soporte de compartición del navegador
   * @returns {Object}
   */
  static getShareCapabilities() {
    return {
      isMobile: isMobileDevice(),
      supportsWebShare: this.supportsWebShare(),
      supportsClipboard: navigator.clipboard && navigator.clipboard.writeText,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    };
  }
}
