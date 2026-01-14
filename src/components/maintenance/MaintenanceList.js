import { Toast } from '../ui/Toast.js';
import { MaintenanceService } from '../../data/firebaseService.js';
import { DocumentPDF } from '../documents/DocumentPDF.js';
import { formatCurrencyRD, formatDate, isMobileDevice, generateWhatsAppURL } from '../../utils/helpers.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';

export class MaintenanceList {
  constructor(onDelete, onEdit) {
    this.onDelete = onDelete;
    this.onEdit = onEdit;
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
  }

  render() {
    const container = document.createElement('div');
    container.className = 'card';

    container.innerHTML = `
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-800">Mantenimientos del Mes</h2>
          <div class="flex items-center gap-2">
            <button id="prev-month" class="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors">
              &lt; Anterior
            </button>
            <span id="month-display" class="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold min-w-max"></span>
            <button id="next-month" class="px-3 py-1.5 bg-gray-300 text-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-400 transition-colors">
              Siguiente &gt;
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <div id="maintenance-container"></div>
          </div>
        </div>
      </div>
    `;

    const prevBtn = container.querySelector('#prev-month');
    const nextBtn = container.querySelector('#next-month');
    const monthDisplay = container.querySelector('#month-display');
    const maintenanceContainer = container.querySelector('#maintenance-container');

    const updateDisplay = async () => {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      
      monthDisplay.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

      try {
        const maintenances = await MaintenanceService.getByMonth(this.currentYear, this.currentMonth);
        this.renderMaintenances(maintenanceContainer, maintenances);
      } catch (error) {
        console.error('Error al cargar mantenimientos:', error);
        maintenanceContainer.innerHTML = `
          <div class="p-8 text-center">
            <p class="text-gray-500">Error al cargar mantenimientos: ${error.message}</p>
            <button class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onclick="location.reload()">Reintentar</button>
          </div>
        `;
        Toast.showError('Error al cargar los mantenimientos');
      }
    };

    prevBtn.addEventListener('click', () => {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      updateDisplay();
    });

    nextBtn.addEventListener('click', () => {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      updateDisplay();
    });

    updateDisplay();
    return container;
  }

  renderMaintenances(container, maintenances) {
    if (maintenances.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center">
          <p class="text-gray-500">No hay mantenimientos registrados para este mes</p>
        </div>
      `;
      return;
    }

    const rows = maintenances.map((m, index) => {
      const amountFormatted = formatCurrencyRD(m.amount);
      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

      return `
        <tr class="${bgClass} border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 font-mono text-sm text-gray-700">${m.number}</td>
          <td class="px-6 py-4 text-sm font-medium text-gray-900">${m.clientName}</td>
          <td class="px-6 py-4 text-sm text-gray-600">${m.serviceDescription}</td>
          <td class="px-6 py-4 text-sm text-gray-600">${formatDate(m.date)}</td>
          <td class="px-6 py-4 text-sm font-semibold text-right text-gray-900">${amountFormatted}</td>
          <td class="px-6 py-4 text-right">
            <div class="flex flex-wrap justify-end items-center gap-2">
              <button class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors print-maintenance flex items-center gap-1" data-id="${m.id}" title="Descargar PDF">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                PDF
              </button>
              <button class="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors share-maintenance" data-id="${m.id}" data-maintenance='${JSON.stringify(m).replace(/'/g, "\\'")}' title="Compartir por WhatsApp">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C9.589 14.195 10.616 14.896 11.713 15.385m0 0l-2.08 2.081a5.09 5.09 0 006.519 0l-2.08-2.081m0 0c4.118-2.582 6.614-7.656 3.461-11.407M19.07 4.927l-2.081 2.081m0 0c-4.118 2.582-6.614 7.656-3.461 11.407"/></svg>
                Compartir
              </button>
              <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors edit-maintenance" data-maintenance='${JSON.stringify(m).replace(/'/g, "\\'")}' title="Editar">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </button>
              <button class="px-3 py-1.5 bg-red-300 text-red-800 rounded-lg text-xs font-semibold hover:bg-red-400 transition-colors delete-maintenance" data-id="${m.id}" title="Eliminar">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    const tableHTML = `
      <table class="w-full">
        <thead class="bg-blue-50 border-b border-gray-200">
          <tr class="text-gray-700 font-semibold text-sm">
            <th class="text-left">Nº</th>
            <th class="text-left">CLIENTE</th>
            <th class="text-left">SERVICIO</th>
            <th class="text-left">FECHA</th>
            <th class="text-right">MONTO</th>
            <th class="text-right">ACCIONES</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    container.innerHTML = tableHTML;

    container.querySelectorAll('.print-maintenance').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
          const docRef = doc(db, 'maintenance', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const maintenance = { id: docSnap.id, ...docSnap.data() };
            const pdf = this.generateMaintenancePDF(maintenance);
            pdf.save(`mantenimiento_${maintenance.number}.pdf`);
            Toast.show('Mantenimiento descargado exitosamente');
          }
        } catch (error) {
          console.error('Error al generar PDF:', error);
          Toast.showError('Error al generar el PDF');
        }
      });
    });

    container.querySelectorAll('.share-maintenance').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const maintenanceData = JSON.parse(btn.getAttribute('data-maintenance'));

        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="animate-spin inline-block">⏳</span> Cargando...';
        btn.disabled = true;

        try {
          const docRef = doc(db, 'maintenance', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const maintenance = { id: docSnap.id, ...docSnap.data() };
            const pdf = this.generateMaintenancePDF(maintenance);
            const pdfBlob = pdf.output('blob');
            const fileName = `mantenimiento_${maintenance.number}.pdf`;

            const canUseNativeShare = isMobileDevice() && navigator.share && navigator.canShare;

            if (canUseNativeShare) {
              const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
              try {
                await navigator.share({
                  title: `Mantenimiento #${maintenance.number}`,
                  text: `Mantenimiento de ${maintenance.clientName} - Monto: ${formatCurrencyRD(maintenance.amount)}`,
                  files: [file]
                });
                Toast.show('Mantenimiento compartido exitosamente');
              } catch (error) {
                if (error.name !== 'AbortError') {
                  this.shareViaWhatsApp(maintenance, fileName);
                }
              }
            } else {
              this.shareViaWhatsApp(maintenance, fileName);
            }
          }
        } catch (error) {
          console.error('Error al compartir:', error);
          Toast.showError('Error al preparar el mantenimiento para compartir');
        } finally {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      });
    });

    container.querySelectorAll('.edit-maintenance').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const maintenanceData = JSON.parse(btn.getAttribute('data-maintenance'));
        this.onEdit(maintenanceData);
      });
    });

    container.querySelectorAll('.delete-maintenance').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('¿Está seguro de eliminar este mantenimiento?')) {
          this.handleDelete(id);
        }
      });
    });
  }

  shareViaWhatsApp(maintenance, fileName) {
    const message = `Hola, le comparto el comprobante de mantenimiento:\n\nMantenimiento: ${maintenance.number}\nCliente: ${maintenance.clientName}\nServicio: ${maintenance.serviceDescription}\nMonto: ${formatCurrencyRD(maintenance.amount)}\nFecha: ${formatDate(maintenance.date)}\n\nGracias!`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(waUrl, '_blank');

    if (isMobileDevice()) {
      Toast.show('Abre WhatsApp, selecciona un contacto y comparte');
    } else {
      Toast.show('Se abrirá WhatsApp Web - selecciona un contacto y envía el PDF');
    }
  }

  generateMaintenancePDF(maintenance) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('COMPROBANTE DE MANTENIMIENTO', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Número: ${maintenance.number}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Fecha: ${formatDate(maintenance.date)}`, margin, yPosition);
    yPosition += 12;

    pdf.setFont(undefined, 'bold');
    pdf.text('DATOS DEL CLIENTE', margin, yPosition);
    yPosition += 7;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Nombre: ${maintenance.clientName}`, margin, yPosition);
    yPosition += 6;
    if (maintenance.clientPhone) {
      pdf.text(`Teléfono: ${maintenance.clientPhone}`, margin, yPosition);
      yPosition += 6;
    }
    if (maintenance.clientAddress) {
      pdf.text(`Dirección: ${maintenance.clientAddress}`, margin, yPosition);
      yPosition += 6;
    }
    yPosition += 6;

    pdf.setFont(undefined, 'bold');
    pdf.text('SERVICIO', margin, yPosition);
    yPosition += 7;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Descripción: ${maintenance.serviceDescription}`, margin, yPosition);
    yPosition += 6;

    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('MONTO:', margin, yPosition);
    pdf.text(formatCurrencyRD(maintenance.amount), pageWidth - margin, yPosition, { align: 'right' });

    return pdf;
  }

  async handleDelete(id) {
    try {
      await MaintenanceService.delete(id);
      Toast.show('Mantenimiento eliminado exitosamente');
      this.onDelete();
    } catch (error) {
      Toast.showError('Error al eliminar: ' + error.message);
    }
  }
}