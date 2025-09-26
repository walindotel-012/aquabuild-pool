// src/components/documents/DocumentPDF.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrencyRD, formatDate } from '../../utils/helpers.js';

export class DocumentPDF {
  // ---------------- COTIZACIÓN ----------------
  static generateQuotePDF(quote) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;

    // 🎨 Colores corporativos
    const primaryColor = [23, 54, 93]; // Azul corporativo
    const lightBlue = [230, 240, 255]; // Azul claro para alternar filas
    const secondaryColor = [0, 128, 0]; // Verde agradecimiento

    // 🔹 Raya azul superior
    doc.setFillColor(...primaryColor);
    doc.rect(0, 10, pageWidth, 3, 'F');

    // 🏢 Encabezado empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('MANTENIMIENTO & REPARACIONES', 20, 20);
    doc.text('DURAN', 20, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('DIRECCIÓN: Calle Buen Pastor #5 Alondra, Pantoja', 20, 34);
    doc.text('TELÉFONO: (809) 856-7741', 20, 39);
    doc.text('CORREO: rogeliodurran88@gmail.com', 20, 44);

    // 📄 Bloque Cotización a la derecha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('COTIZACIÓN', pageWidth - 20, 20, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`N° DE COTIZACIÓN: ${quote.number || '0001'}`, pageWidth - 20, 28, { align: 'right' });
    doc.text(`FECHA: ${formatDate(quote.date)}`, pageWidth - 20, 33, { align: 'right' });
    doc.text(`VÁLIDO HASTA: ${formatDate(this.addDays(quote.date, 15))}`, pageWidth - 20, 38, { align: 'right' });

    // 📦 Caja Datos Empresa/Cliente (con bordes ovalados)
    doc.setDrawColor(...primaryColor);
    doc.roundedRect(15, 55, pageWidth - 30, 35, 3, 3); // caja con esquinas redondeadas
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('DATOS DE LA EMPRESA', 20, 62);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Cliente: ${quote.clientName || ''}`, 20, 70);
    doc.text(`Empresa: ${quote.clientCompany || ''}`, 20, 75);
    doc.text(`Dirección: ${quote.clientAddress || ''}`, 20, 80);
    doc.text(`Teléfono: ${quote.clientPhone || ''}`, 20, 85);

    // 📋 Tabla Items
    const startY = 100;
    const columns = ['CANT.', 'DESCRIPCIÓN', 'TOTAL'];
    const rows = quote.items.map(item => [
      item.quantity.toString(),
      item.description,
      formatCurrencyRD(item.total)
    ]);

    doc.autoTable({
      startY,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center'
      },
      styles: { fontSize: 9, cellPadding: 2 },
      alternateRowStyles: { fillColor: lightBlue },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: 'right' }
      }
    });

    // 💰 Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL:', pageWidth - 60, finalY);
    doc.text(formatCurrencyRD(quote.total), pageWidth - 20, finalY, { align: 'right' });

    // 📑 Términos y Condiciones (cuadro con borde)
    const termsY = finalY + 15;
    doc.setDrawColor(...primaryColor);
    doc.rect(15, termsY - 6, pageWidth - 30, 40); // borde sin relleno

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('TÉRMINOS Y CONDICIONES', 20, termsY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const terms = [
      '1. Esta cotización se ajusta a las cláusulas y condiciones que se enuncian',
      '2. Duración de la oferta: 15 días',
      '3. Para iniciar el servicio el cliente realizará un anticipo del 50%',
      '4. En el transcurso del trabajo el cliente tiene que dar el 25%',
      '5. Al finalizar el trabajo el cliente dará el 25% restante'
    ];
    let currentY = termsY + 6;
    terms.forEach(term => {
      doc.text(term, 20, currentY);
      currentY += 4;
    });

    // ✍️ Firma cliente
    currentY += 10;
    doc.text('Nombre del cliente: ____________________________', 20, currentY);

    // 📞 Nota de contacto
    currentY += 15;
    doc.setFontSize(8);
    doc.text('Si usted tiene alguna pregunta sobre esta cotización, por favor, póngase en contacto con nosotros.', 20, currentY);

    // ✅ Mensaje final
    currentY += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text('Gracias por la preferencia!', 20, currentY);

    // 🔹 Raya azul inferior
    doc.setFillColor(...primaryColor);
    doc.rect(0, 287, pageWidth, 3, 'F');

    return doc;
  }

  // ---------------- FACTURA ----------------
  static generateInvoicePDF(invoice) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;

    const primaryColor = [23, 54, 93];
    const lightBlue = [230, 240, 255];
    const secondaryColor = [0, 128, 0];

    // 🔹 Raya azul superior
    doc.setFillColor(...primaryColor);
    doc.rect(0, 10, pageWidth, 3, 'F');

    // Encabezado empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('MANTENIMIENTO & REPARACIONES', 20, 20);
    doc.text('DURAN', 20, 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('DIRECCIÓN: Calle Buen Pastor #5 Alondra, Pantoja', 20, 34);
    doc.text('TELÉFONO: (809) 856-7741', 20, 39);
    doc.text('CORREO: rogeliodurran88@gmail.com', 20, 44);

    // Bloque Factura a la derecha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('FACTURA', pageWidth - 20, 20, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`N° DE FACTURA: ${invoice.number || '0001'}`, pageWidth - 20, 28, { align: 'right' });
    doc.text(`FECHA: ${formatDate(invoice.date)}`, pageWidth - 20, 33, { align: 'right' });

    // Caja Datos Cliente
    doc.setDrawColor(...primaryColor);
    doc.roundedRect(15, 55, pageWidth - 30, 30, 3, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text('DATOS DEL CLIENTE', 20, 62);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Cliente: ${invoice.clientName || ''}`, 20, 70);
    doc.text(`Dirección: ${invoice.clientAddress || ''}`, 20, 75);
    doc.text(`Teléfono: ${invoice.clientPhone || ''}`, 20, 80);

    // Tabla Items
    const startY = 95;
    const columns = ['CANT.', 'DESCRIPCIÓN', 'TOTAL'];
    const rows = invoice.items.map(item => [
      item.quantity.toString(),
      item.description,
      formatCurrencyRD(item.total)
    ]);

    doc.autoTable({
      startY,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 9,
        halign: 'center'
      },
      styles: { fontSize: 9, cellPadding: 2 },
      alternateRowStyles: { fillColor: lightBlue },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 120 },
        2: { cellWidth: 40, halign: 'right' }
      }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('TOTAL:', pageWidth - 60, finalY);
    doc.text(formatCurrencyRD(invoice.total), pageWidth - 20, finalY, { align: 'right' });

    // Mensaje final
    const noteY = finalY + 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text('¡Gracias por su pago!', 20, noteY);

    // 🔹 Raya azul inferior
    doc.setFillColor(...primaryColor);
    doc.rect(0, 287, pageWidth, 3, 'F');

    return doc;
  }

  // ---------------- HELPER ----------------
  static addDays(dateString, days) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
