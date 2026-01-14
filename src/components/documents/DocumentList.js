import { Toast } from '../ui/Toast.js';
import { QuoteService, InvoiceService } from '../../data/firebaseService.js';
import { DocumentPDF } from './DocumentPDF.js';
import { formatCurrencyRD, formatDate, isMobileDevice, generateWhatsAppURL } from '../../utils/helpers.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';

export class DocumentList {
  constructor(type, onDelete) {
    this.type = type;
    this.onDelete = onDelete;
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'card';
    
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando ${this.type === 'quote' ? 'cotizaciones' : 'facturas'}...</p>
      </div>
    `;
    
    this.loadDocuments(container);
    return container;
  }
  
  async loadDocuments(container) {
    try {
      let documents;
      if (this.type === 'quote') {
        documents = await QuoteService.getAll();
      } else {
        documents = await InvoiceService.getAll();
      }
      
      documents = this.sortDocuments(documents);
      
      this.currentDocuments = documents;
      
      if (documents.length === 0) {
        const message = this.type === 'quote' 
          ? 'No hay cotizaciones registradas' 
          : 'No hay facturas registradas';
        
        container.innerHTML = `
          <div class="text-center py-8">
            <p class="text-gray-500">${message}</p>
          </div>
        `;
        return;
      }
      
      this.renderDocuments(container, documents);
      
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      Toast.showError('Error al cargar documentos');
      container.innerHTML = `
        <div class="text-center py-8">
          <p class="text-red-500">Error al cargar ${this.type === 'quote' ? 'cotizaciones' : 'facturas'}</p>
          <button class="btn btn-primary mt-4 retry-button">Reintentar</button>
        </div>
      `;
      
      container.querySelector('.retry-button').addEventListener('click', () => {
        this.loadDocuments(container);
      });
    }
  }
  
  sortDocuments(documents) {
    return documents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      return dateB - dateA;
    });
  }

  shareViaWhatsApp(invoice, fileName) {
    const waUrl = generateWhatsAppURL(invoice);
    window.open(waUrl, '_blank');
    
    if (isMobileDevice()) {
      Toast.show('Abre WhatsApp, selecciona un contacto y comparte');
    } else {
      Toast.show('Se abrirá WhatsApp Web - selecciona un contacto y envía el PDF');
    }
  }

  renderDocuments(container, documents) {
    const headers = this.type === 'quote' 
      ? '<th class="text-left">Nº</th><th class="text-left">CLIENTE</th><th class="text-left">FECHA</th><th class="text-right">TOTAL</th><th class="text-center">ESTADO</th><th class="text-right">ACCIONES</th>'
      : '<th class="text-left">Nº</th><th class="text-left">CLIENTE</th><th class="text-left">FECHA</th><th class="text-right">TOTAL</th><th class="text-right">ACCIONES</th>';
    
    const rows = documents.map((doc, index) => {
      const totalFormatted = formatCurrencyRD(doc.total);
      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      
      if (this.type === 'quote') {
        const statusClass = doc.status === 'Pendiente' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';
        return `
          <tr class="${bgClass} border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-mono text-sm text-gray-700">${doc.number}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${doc.clientName}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(doc.date)}</td>
            <td class="px-6 py-4 text-sm font-semibold text-right text-gray-900">${totalFormatted}</td>
            <td class="px-6 py-4 text-center"><span class="px-3 py-1 rounded text-xs font-semibold ${statusClass}">${doc.status}</span></td>
            <td class="px-6 py-4 text-right">
              <div class="flex flex-wrap justify-end items-center gap-2">
                <button class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors print-quote flex items-center gap-1" data-id="${doc.id}" title="Descargar PDF">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  PDF
                </button>
                <button class="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors convert-to-invoice" data-quote='${JSON.stringify(doc).replace(/'/g, "\\'")}' title="Convertir a factura">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
                <button class="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors share-quote" data-id="${doc.id}" data-quote='${JSON.stringify(doc).replace(/'/g, "\\'")}' title="Compartir por WhatsApp">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C9.589 14.195 10.616 14.896 11.713 15.385m0 0l-2.08 2.081a5.09 5.09 0 006.519 0l-2.08-2.081m0 0c4.118-2.582 6.614-7.656 3.461-11.407M19.07 4.927l-2.081 2.081m0 0c-4.118 2.582-6.614 7.656-3.461 11.407"/></svg>
                  Compartir
                </button>
                <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors edit-quote" data-quote='${JSON.stringify(doc).replace(/'/g, "\\'")}' title="Editar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="px-3 py-1.5 bg-red-300 text-red-800 rounded-lg text-xs font-semibold hover:bg-red-400 transition-colors delete-doc" data-id="${doc.id}" title="Eliminar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      } else {
        return `
          <tr class="${bgClass} border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 font-mono text-sm text-gray-700">${doc.number}</td>
            <td class="px-6 py-4 text-sm font-medium text-gray-900">${doc.clientName}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${formatDate(doc.date)}</td>
            <td class="px-6 py-4 text-sm font-semibold text-right text-gray-900">${totalFormatted}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex flex-wrap justify-end items-center gap-2">
                <button class="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors print-invoice flex items-center gap-1" data-id="${doc.id}" title="Descargar PDF">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                  PDF
                </button>
                <button class="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors share-invoice" data-id="${doc.id}" data-invoice='${JSON.stringify(doc).replace(/'/g, "\\'")}' title="Compartir por WhatsApp">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C9.589 14.195 10.616 14.896 11.713 15.385m0 0l-2.08 2.081a5.09 5.09 0 006.519 0l-2.08-2.081m0 0c4.118-2.582 6.614-7.656 3.461-11.407M19.07 4.927l-2.081 2.081m0 0c-4.118 2.582-6.614 7.656-3.461 11.407"/></svg>
                  Compartir
                </button>
                <button class="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors edit-invoice" data-invoice='${JSON.stringify(doc).replace(/'/g, "\\'")}' title="Editar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="px-3 py-1.5 bg-red-300 text-red-800 rounded-lg text-xs font-semibold hover:bg-red-400 transition-colors delete-doc" data-id="${doc.id}" title="Eliminar">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }
    }).join('');
    
    const tableHTML = `
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-blue-50 border-b border-gray-200">
              <tr class="text-gray-700 font-semibold text-sm">
                ${headers}
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
    
    container.innerHTML = tableHTML;
    
    container.querySelectorAll('.print-quote').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
          const docRef = doc(db, 'quotes', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const quote = { id: docSnap.id, ...docSnap.data() };
            const pdf = DocumentPDF.generateQuotePDF(quote);
            pdf.save(`cotizacion_${quote.number}.pdf`);
            Toast.show('¡Cotización impresa exitosamente!');
          }
        } catch (error) {
          console.error('Error al generar PDF:', error);
          Toast.showError('Error al generar el PDF');
        }
      });
    });
    
    container.querySelectorAll('.print-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
          const docRef = doc(db, 'invoices', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const invoice = { id: docSnap.id, ...docSnap.data() };
            const pdf = DocumentPDF.generateInvoicePDF(invoice);
            pdf.save(`factura_${invoice.number}.pdf`);
            Toast.show('¡Factura impresa exitosamente!');
          }
        } catch (error) {
          console.error('Error al generar PDF:', error);
          Toast.showError('Error al generar el PDF');
        }
      });
    });
    
    container.querySelectorAll('.convert-to-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const quoteData = JSON.parse(btn.getAttribute('data-quote'));
        try {
          const invoiceData = {
            number: 'FAC-' + String(Math.floor(Math.random() * 1000000)).padStart(5, '0'),
            clientName: quoteData.clientName,
            clientId: quoteData.clientId,
            date: new Date().toISOString().split('T')[0],
            items: quoteData.items || [],
            total: quoteData.total,
            status: 'Pendiente',
            relatedQuoteId: quoteData.id
          };
          
          await InvoiceService.create(invoiceData);
          await QuoteService.delete(quoteData.id);
          Toast.show('¡Cotización convertida a factura exitosamente!');
          this.onDelete();
        } catch (error) {
          Toast.showError('Error al convertir a factura: ' + error.message);
        }
      });
    });
    
    container.querySelectorAll('.edit-quote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quoteData = JSON.parse(btn.getAttribute('data-quote'));
        this.onEdit('quote', quoteData);
      });
    });
    
    container.querySelectorAll('.share-quote').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const quoteData = JSON.parse(btn.getAttribute('data-quote'));
        
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="animate-spin inline-block">⏳</span> Cargando...';
        btn.disabled = true;
        
        try {
          const docRef = doc(db, 'quotes', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const quote = { id: docSnap.id, ...docSnap.data() };
            const pdf = DocumentPDF.generateQuotePDF(quote);
            const pdfBlob = pdf.output('blob');
            const fileName = `cotizacion_${quote.number}.pdf`;
            
            const canUseNativeShare = isMobileDevice() && navigator.share && navigator.canShare;
            
            if (canUseNativeShare) {
              const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
              try {
                await navigator.share({
                  title: `Cotización #${quote.number}`,
                  text: `Cotización de ${quote.clientName} - Total: ${formatCurrencyRD(quote.total)}`,
                  files: [file]
                });
                Toast.show('Cotización compartida exitosamente');
              } catch (error) {
                if (error.name !== 'AbortError') {
                  this.shareViaWhatsApp(quote, fileName);
                }
              }
            } else {
              this.shareViaWhatsApp(quote, fileName);
            }
          }
        } catch (error) {
          console.error('Error al compartir:', error);
          Toast.showError('Error al preparar la cotización para compartir');
        } finally {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      });
    });
    
    container.querySelectorAll('.edit-invoice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const invoiceData = JSON.parse(btn.getAttribute('data-invoice'));
        this.onEdit('invoice', invoiceData);
      });
    });
    
    container.querySelectorAll('.share-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const invoiceData = JSON.parse(btn.getAttribute('data-invoice'));
        
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span class="animate-spin inline-block">⏳</span> Cargando...';
        btn.disabled = true;
        
        try {
          const docRef = doc(db, 'invoices', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const invoice = { id: docSnap.id, ...docSnap.data() };
            const pdf = DocumentPDF.generateInvoicePDF(invoice);
            const pdfBlob = pdf.output('blob');
            const fileName = `factura_${invoice.number}.pdf`;
            
            const canUseNativeShare = isMobileDevice() && navigator.share && navigator.canShare;
            
            if (canUseNativeShare) {
              const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
              try {
                await navigator.share({
                  title: `Factura #${invoice.number}`,
                  text: `Factura de ${invoice.clientName} - Total: ${formatCurrencyRD(invoice.total)}`,
                  files: [file]
                });
                Toast.show('Factura compartida exitosamente');
              } catch (error) {
                if (error.name !== 'AbortError') {
                  this.shareViaWhatsApp(invoice, fileName);
                }
              }
            } else {
              this.shareViaWhatsApp(invoice, fileName);
            }
          }
        } catch (error) {
          console.error('Error al compartir:', error);
          Toast.showError('Error al preparar la factura para compartir');
        } finally {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      });
    });
    
    container.querySelectorAll('.delete-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const confirmMsg = this.type === 'quote' 
          ? '¿Está seguro de eliminar esta cotización?' 
          : '¿Está seguro de eliminar esta factura?';
        
        if (confirm(confirmMsg)) {
          this.handleDelete(id);
        }
      });
    });
  }
  
  filterDocuments(searchTerm) {
    if (!searchTerm.trim()) {
      return this.sortDocuments([...this.currentDocuments]);
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    const filtered = this.currentDocuments.filter(doc => {
      const clientMatch = doc.clientName.toLowerCase().includes(searchTermLower);
      const numberMatch = doc.number.toLowerCase().includes(searchTermLower);
      const totalText = doc.total.toString();
      const totalMatch = totalText.includes(searchTermLower) || 
                        formatCurrencyRD(doc.total).toLowerCase().includes(searchTermLower);
      
      return clientMatch || numberMatch || totalMatch;
    });
    
    return this.sortDocuments(filtered);
  }
  
  async handleDelete(id) {
    try {
      if (this.type === 'quote') {
        await QuoteService.delete(id);
        Toast.show('¡Cotización eliminada exitosamente!');
      } else {
        await InvoiceService.delete(id);
        Toast.show('¡Factura eliminada exitosamente!');
      }
      this.onDelete();
    } catch (error) {
      Toast.showError('Error al eliminar: ' + error.message);
    }
  }
  
  setOnEditCallback(callback) {
    this.onEditCallback = callback;
  }
  
  onEdit(type, document) {
    if (this.onEditCallback) {
      this.onEditCallback(type, document);
    }
  }
}