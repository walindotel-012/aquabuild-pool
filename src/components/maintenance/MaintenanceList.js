import { Toast } from '../ui/Toast.js';
import { MaintenanceInvoiceService, ClientService } from '../../data/firebaseService.js';
import { formatCurrencyRD, formatDate, generateWhatsAppMessageURL } from '../../utils/helpers.js';
import { DocumentPDF } from '../documents/DocumentPDF.js';

export class MaintenanceList {
  constructor(onRefreshCallback) {
    this.onRefreshCallback = onRefreshCallback;
    this.currentMonth = new Date();
    this.invoices = [];
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    // Filtro de mes
    const filterDiv = document.createElement('div');
    filterDiv.className = 'bg-white rounded-xl p-6 border border-gray-100 shadow-sm';
    filterDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="text-sm font-semibold text-gray-700">Filtrar por mes:</label>
          <div class="flex items-center gap-2">
            <button id="prev-month" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Mes anterior">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <input type="month" id="month-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value="${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}">
            <button id="next-month" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Mes siguiente">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
        <button id="generate-invoices" class="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Generar Facturas del Mes
        </button>
      </div>
    `;
    container.appendChild(filterDiv);

    // Cargar y mostrar facturas
    try {
      await this.loadInvoices();
      const listElement = await this.renderInvoices();
      container.appendChild(listElement);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-6 text-center';
      errorDiv.innerHTML = `
        <p class="text-red-600 mb-4">Error al cargar las facturas</p>
        <button id="retry-invoices" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reintentar</button>
      `;
      container.appendChild(errorDiv);
      const retryBtn = errorDiv.querySelector('#retry-invoices');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          this.onRefreshCallback?.();
        });
      }
    }

    // Eventos
    setTimeout(() => {
      this.setupFilterEvents(container);
      this.setupGenerateButton(container);
    }, 100);

    return container;
  }

  async loadInvoices() {
    try {
      const year = this.currentMonth.getFullYear();
      const month = this.currentMonth.getMonth();
      this.invoices = await MaintenanceInvoiceService.getByMonth(year, month);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      throw error;
    }
  }

  async renderInvoices() {
    const container = document.createElement('div');

    if (this.invoices.length === 0) {
      container.className = 'bg-gray-50 border border-gray-200 rounded-lg p-12 text-center';
      container.innerHTML = `
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Sin facturas de mantenimiento</h3>
        <p class="text-gray-600">No hay facturas generadas para este mes.</p>
      `;
      return container;
    }

    container.className = 'space-y-4';

    for (const invoice of this.invoices) {
      const invoiceElement = await this.createInvoiceCard(invoice);
      container.appendChild(invoiceElement);
    }

    return container;
  }

  async createInvoiceCard(invoice) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6';
    card.id = `invoice-${invoice.id}`;

    const generatedDate = new Date(invoice.generatedDate);
    const dueDate = new Date(invoice.dueDate);
    const statusClass = invoice.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    const statusText = invoice.isPaid ? 'Pagada' : 'Pendiente';

    card.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <!-- Cliente -->
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Cliente</span>
          <span class="text-base font-semibold text-gray-900">${invoice.clientName}</span>
          <span class="text-xs text-gray-500 mt-1">${invoice.clientPhone}</span>
        </div>

        <!-- Número y Servicio -->
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Factura</span>
          <span class="text-base font-bold text-blue-600">${invoice.number}</span>
          <span class="text-xs text-gray-600 mt-1">${invoice.serviceName}</span>
        </div>

        <!-- Monto y Fecha -->
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Monto</span>
          <span class="text-lg font-bold text-gray-900">${formatCurrencyRD(invoice.amount)}</span>
          <span class="text-xs text-gray-500 mt-1">${formatDate(generatedDate)}</span>
        </div>

        <!-- Estado -->
        <div class="flex flex-col">
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Estado</span>
          <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusClass} w-fit">${statusText}</span>
          <span class="text-xs text-gray-500 mt-2">Vence: ${formatDate(dueDate)}</span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <button class="pdf-invoice px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
          PDF
        </button>
        <button class="whatsapp-invoice px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 2.704.9 5.31 2.574 7.412l-2.74 10.014c-.127.462-.23.93-.23 1.412a2.98 2.98 0 002.98 2.98 2.98 2.98 0 001.412-.23l10.014-2.74c2.1 1.674 4.708 2.574 7.412 2.574a9.868 9.868 0 009.798-9.746 9.87 9.87 0 00-9.798-9.746z"/>
          </svg>
          WhatsApp
        </button>
        <button class="mark-paid px-4 py-2 ${invoice.isPaid ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-green-50 text-green-600 hover:bg-green-100'} rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          ${invoice.isPaid ? 'Pagada' : 'Marcar Pagada'}
        </button>
        <button class="delete-invoice px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Eliminar
        </button>
      </div>
    `;

    // Eventos
    const pdfBtn = card.querySelector('.pdf-invoice');
    pdfBtn?.addEventListener('click', () => {
      this.generateAndDownloadPDF(invoice);
    });

    const whatsappBtn = card.querySelector('.whatsapp-invoice');
    whatsappBtn?.addEventListener('click', () => {
      this.shareViaWhatsApp(invoice);
    });

    const markPaidBtn = card.querySelector('.mark-paid');
    markPaidBtn?.addEventListener('click', async () => {
      if (!invoice.isPaid) {
        await this.markAsPaid(invoice);
      }
    });

    const deleteBtn = card.querySelector('.delete-invoice');
    deleteBtn?.addEventListener('click', async () => {
      await this.deleteInvoice(invoice);
    });

    return card;
  }

  async generateAndDownloadPDF(invoice) {
    try {
      Toast.show('⏳ Generando PDF...');
      
      const pdfGenerator = new DocumentPDF();
      const doc = DocumentPDF.generateMaintenanceInvoicePDF(invoice);
      doc.save(`${invoice.number}.pdf`);
      
      Toast.show('✓ PDF generado correctamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Toast.showError('Error al generar PDF: ' + error.message);
    }
  }

  shareViaWhatsApp(invoice) {
    try {
      const message = `Hola ${invoice.clientName}, 

Tu factura de mantenimiento está lista:

📋 Factura: ${invoice.number}
💰 Monto: ${formatCurrencyRD(invoice.amount)}
📅 Fecha: ${formatDate(new Date(invoice.generatedDate))}
🔧 Servicio: ${invoice.serviceName}
⏰ Vence: ${formatDate(new Date(invoice.dueDate))}

Por favor realiza el pago en el plazo indicado.

¡Gracias por tu preferencia!`;

      const whatsappUrl = generateWhatsAppMessageURL(invoice.clientPhone, message);
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
        Toast.show('✓ Abierto WhatsApp');
      }
    } catch (error) {
      console.error('Error al compartir por WhatsApp:', error);
      Toast.showError('Error al compartir: ' + error.message);
    }
  }

  async markAsPaid(invoice) {
    try {
      await MaintenanceInvoiceService.update(invoice.id, { isPaid: true });
      Toast.show('✓ Factura marcada como pagada');
      if (this.onRefreshCallback) {
        this.onRefreshCallback();
      }
    } catch (error) {
      console.error('Error al marcar como pagada:', error);
      Toast.showError('Error al actualizar: ' + error.message);
    }
  }

  async deleteInvoice(invoice) {
    if (confirm(`¿Estás seguro de que deseas eliminar la factura ${invoice.number}?`)) {
      try {
        await MaintenanceInvoiceService.delete(invoice.id);
        Toast.show('✓ Factura eliminada correctamente');
        if (this.onRefreshCallback) {
          this.onRefreshCallback();
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        Toast.showError('Error al eliminar: ' + error.message);
      }
    }
  }

  setupFilterEvents(container) {
    const monthInput = container.querySelector('#month-filter');
    const prevBtn = container.querySelector('#prev-month');
    const nextBtn = container.querySelector('#next-month');

    monthInput?.addEventListener('change', (e) => {
      const [year, month] = e.target.value.split('-');
      this.currentMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      if (this.onRefreshCallback) {
        this.onRefreshCallback();
      }
    });

    prevBtn?.addEventListener('click', () => {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
      monthInput.value = `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`;
      if (this.onRefreshCallback) {
        this.onRefreshCallback();
      }
    });

    nextBtn?.addEventListener('click', () => {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
      monthInput.value = `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`;
      if (this.onRefreshCallback) {
        this.onRefreshCallback();
      }
    });
  }

  setupGenerateButton(container) {
    const generateBtn = container.querySelector('#generate-invoices');
    generateBtn?.addEventListener('click', async () => {
      try {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="animate-spin">⏳</span> Generando...';
        
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        const generated = await MaintenanceInvoiceService.generateMonthlyInvoices(year, month);
        
        if (generated.length > 0) {
          Toast.show(`✓ ${generated.length} factura(s) generada(s) correctamente`);
          if (this.onRefreshCallback) {
            this.onRefreshCallback();
          }
        } else {
          Toast.show('ℹ No hay nuevas asignaciones para facturar este mes');
        }
      } catch (error) {
        console.error('Error al generar facturas:', error);
        Toast.showError('Error al generar facturas: ' + error.message);
      } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Generar Facturas del Mes
        `;
      }
    });
  }
}
