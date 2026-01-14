// src/utils/helpers.js
export const formatCurrencyRD = (amount) => {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-DO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Detecta si el usuario está en un dispositivo móvil
 * @returns {boolean}
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antiguos
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    }
  } catch (err) {
    console.error('Error al copiar:', err);
    return false;
  }
};

/**
 * Genera URL de WhatsApp para compartir
 * @param {Object} invoice - Datos de la factura
 * @param {string} phone - Número de teléfono (opcional)
 * @returns {string}
 */
export const generateWhatsAppURL = (invoice, phone = null) => {
  const text = encodeURIComponent(
    `📋 *Factura* #${invoice.number}\n\n` +
    `*Cliente:* ${invoice.clientName}\n` +
    `*Total:* ${formatCurrencyRD(invoice.total)}\n` +
    `*Fecha:* ${formatDate(invoice.date)}\n\n` +
    `¡Factura adjunta! Desde Piscinas Durán`
  );
  
  if (phone) {
    // Si se proporciona un número de teléfono
    return `https://wa.me/${phone}?text=${text}`;
  } else {
    // Sin número, permite al usuario seleccionar contacto
    return `https://wa.me/?text=${text}`;
  }
};
