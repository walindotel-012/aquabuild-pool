// src/components/documents/DocumentPDF.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrencyRD, formatDate } from '../../utils/helpers.js';

export class DocumentPDF {
  static generateQuotePDF(quote) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Colores
    const primaryColor = [30, 64, 175]; // Azul oscuro
    const secondaryColor = [8, 145, 178]; // Azul cian
    
    // Header - Logo y título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('COTIZACIÓN', 20, 25);
    
    // Información de la empresa (izquierda)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('MANTENIMIENTO & REPARACIONES DURÁN', 20, 35);
    doc.text('C/ Buen Pastor, Num. 5, sector Alondra, Los Alcarrizos', 20, 40);
    doc.text('TELÉFONOS: (809) 856-7741', 20, 45);
    doc.text('CORREO: rogeliodurran88@gmail.com', 20, 50);
    
    
    // Información del documento (derecha)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('DATOS DE LA COTIZACIÓN', pageWidth - 20, 35, null, null, 'right');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° DE COTIZACIÓN: ${quote.number || '0001'}`, pageWidth - 20, 40, null, null, 'right');
    doc.text(`FECHA: ${formatDate(quote.date)}`, pageWidth - 20, 45, null, null, 'right');
    doc.text(`VÁLIDO HASTA: ${formatDate(this.addDays(quote.date, 15))}`, pageWidth - 20, 50, null, null, 'right');
    
    
    // Línea separadora
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 60, pageWidth - 15, 60);
    
    // Información del cliente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('CLIENTE:', 20, 70);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(quote.clientName || 'Cliente no especificado', 20, 75);
    if (quote.clientPhone) doc.text(`TELÉFONO: ${quote.clientPhone}`, 20, 80);
    if (quote.clientAddress) doc.text(`DIRECCIÓN: ${quote.clientAddress}`, 20, 85);
    
    // Tabla de items
    const startY = 95;
    const columns = ['CANT.', 'DESCRIPCIÓN', 'TOTAL'];
    const rows = [];
    
    quote.items.forEach((item, index) => {
      rows.push([
        item.quantity.toString(),
        item.description,
        formatCurrencyRD(item.total)
      ]);
    });
    
    doc.autoTable({
      startY: startY,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { 
        fillColor: primaryColor,
        fontSize: 10,
        halign: 'center'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: 'right' }
      },
      didDrawPage: function (data) {
        // Footer en cada página
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('MANTENIMIENTO & REPARACIONES DURAN', 15, pageHeight - 15);
        doc.text('Calle Buen Pastor #5 Alondra, Pantoja • TEL: (809) 856-7741', 15, pageHeight - 10);
      }
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('TOTAL:', pageWidth - 60, finalY, null, null, 'right');
    doc.text(formatCurrencyRD(quote.total), pageWidth - 20, finalY, null, null, 'right');
    
    // Términos y condiciones
    const termsY = finalY + 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('TÉRMINOS Y CONDICIONES', 20, termsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const terms = [
      '1. Duración de la oferta: 15 días',
      '2. Para iniciar el servicio se realizará el anticipo del 50%',
      '3. En el transcurso del adelanto de trabajo el cliente tiene que dar el 25%',
      '4. Al finalizar el trabajo tiene que dar el 25% restante'
    ];
    
    let currentY = termsY + 8;
    terms.forEach(term => {
      doc.text(term, 20, currentY);
      currentY += 5;
    });
    
    // Firma del cliente
    const signatureY = currentY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('La aceptación del cliente (firmar a continuación):', 20, signatureY);
    
    // Línea para firma
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.line(20, signatureY + 8, 100, signatureY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Nombre del cliente', 20, signatureY + 12);
    
    // Mensaje de agradecimiento
    const thankYouY = signatureY + 25;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...secondaryColor);
    doc.text('¡Gracias por la preferencia!', 20, thankYouY);
    
    // Nota de contacto
    const contactY = thankYouY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('Si usted tiene alguna pregunta sobre esta cotización, por favor, póngase en contacto con nosotros.', 20, contactY);
    
    return doc;
  }
  
  static generateInvoicePDF(invoice) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    
    // Colores
    const primaryColor = [30, 64, 175];
    const secondaryColor = [8, 145, 178];
    
    // Header - Logo y título
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('FACTURA', 20, 25);
    
    // Información de la empresa (izquierda)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('MANTENIMIENTO & REPARACIONES DURAN', 20, 35);
    doc.text('Calle Buen Pastor #5 Alondra, Pantoja', 20, 40);
    doc.text('TELÉFONOS: (809) 856-7741', 20, 45);
    doc.text('CORREO: rogeliodurran88@gmail.com', 20, 50);
   
    
    // Información del documento (derecha)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('DATOS DE LA FACTURA', pageWidth - 20, 35, null, null, 'right');
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`N° DE FACTURA: ${invoice.number || '0001'}`, pageWidth - 20, 40, null, null, 'right');
    doc.text(`FECHA: ${formatDate(invoice.date)}`, pageWidth - 20, 45, null, null, 'right');
  
    
    // Línea separadora
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 60, pageWidth - 15, 60);
    
    // Información del cliente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.text('CLIENTE:', 20, 70);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice.clientName || 'Cliente no especificado', 20, 75);
    if (invoice.clientPhone) doc.text(`TELÉFONO: ${invoice.clientPhone}`, 20, 80);
    if (invoice.clientAddress) doc.text(`DIRECCIÓN: ${invoice.clientAddress}`, 20, 85);
    
    // Tabla de items
    const startY = 95;
    const columns = ['CANT.', 'DESCRIPCIÓN', 'TOTAL'];
    const rows = [];
    
    invoice.items.forEach((item, index) => {
      rows.push([
        item.quantity.toString(),
        item.description,
        formatCurrencyRD(item.total)
      ]);
    });
    
    doc.autoTable({
      startY: startY,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { 
        fillColor: primaryColor,
        fontSize: 10,
        halign: 'center'
      },
      styles: { 
        fontSize: 9,
        cellPadding: 2
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: 'right' }
      }
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('TOTAL:', pageWidth - 60, finalY, null, null, 'right');
    doc.text(formatCurrencyRD(invoice.total), pageWidth - 20, finalY, null, null, 'right');
    
    // Nota de pago
    const paymentY = finalY + 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...secondaryColor);
    doc.text('¡Gracias por su pago!', 20, paymentY);
    
    return doc;
  }
  
  // Helper para sumar días a una fecha
  static addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}