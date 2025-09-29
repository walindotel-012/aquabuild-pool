import { Toast } from '../ui/Toast.js';
import { QuoteService, InvoiceService } from '../../data/firebaseService.js';
import { DocumentPDF } from './DocumentPDF.js';
import { formatCurrencyRD, formatDate } from '../../utils/helpers.js';
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
  
  renderDocuments(container, documents) {
    const headers = this.type === 'quote' 
      ? '<th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th>'
      : '<th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Acciones</th>';
    
    const rows = documents.map(doc => {
      const totalFormatted = formatCurrencyRD(doc.total);
      if (this.type === 'quote') {
        const statusClass = doc.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
        return `
          <tr>
            <td class="font-mono">${doc.number}</td>
            <td class="font-medium">${doc.clientName}</td>
            <td>${formatDate(doc.date)}</td>
            <td class="font-medium">${totalFormatted}</td>
            <td><span class="px-2 py-1 rounded text-xs font-medium ${statusClass}">${doc.status}</span></td>
            <td>
            <div class="flex flex-wrap justify-start items-center gap-2">
              <button class="btn btn-warning btn-sm min-w-[100px] print-quote" data-id="${doc.id}">Imprimir</button>
              <button class="btn btn-success btn-sm min-w-[100px] convert-to-invoice" data-quote='${JSON.stringify(doc).replace(/'/g, "\\'")}'>Convertir a Factura</button>
              <button class="btn btn-primary btn-sm min-w-[100px] edit-quote" data-quote='${JSON.stringify(doc).replace(/'/g, "\\'")}'>Editar</button>
              <button class="btn btn-danger btn-sm min-w-[100px] delete-doc" data-id="${doc.id}">Eliminar</button>
            </div>
          </td>
          </tr>
        `;
      } else {
        return `
          <tr>
            <td class="font-mono">${doc.number}</td>
            <td class="font-medium">${doc.clientName}</td>
            <td>${formatDate(doc.date)}</td>
            <td class="font-medium">${totalFormatted}</td>
            <td>
            <div class="flex flex-wrap justify-start items-center gap-2">
              <button class="btn btn-warning btn-sm min-w-[100px] print-invoice" data-id="${doc.id}">Imprimir</button>
              <button class="btn btn-primary btn-sm min-w-[100px] edit-invoice" data-invoice='${JSON.stringify(doc).replace(/'/g, "\\'")}'>Editar</button>
              <button class="btn btn-danger btn-sm min-w-[100px] delete-doc" data-id="${doc.id}">Eliminar</button>
            </div>
          </td>

          </tr>
        `;
      }
    }).join('');
    
    const tableHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    
    container.innerHTML = tableHTML;
    
    // Event listeners para imprimir
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
    
    // Event listeners para conversión
    container.querySelectorAll('.convert-to-invoice').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const quoteData = JSON.parse(btn.getAttribute('data-quote'));
        try {
          const invoiceData = {
            clientId: quoteData.clientId,
            clientName: quoteData.clientName,
            clientPhone: quoteData.clientPhone,
            clientAddress: quoteData.clientAddress,
            date: new Date().toISOString().split('T')[0],
            items: quoteData.items,
            total: quoteData.total,
            relatedQuoteId: quoteData.id
          };
          
          await InvoiceService.create(invoiceData);
          Toast.show('¡Cotización convertida a factura exitosamente!');
          this.onDelete();
        } catch (error) {
          Toast.showError('Error al convertir a factura: ' + error.message);
        }
      });
    });
    
    // Event listeners para editar
    container.querySelectorAll('.edit-quote').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const quoteData = JSON.parse(btn.getAttribute('data-quote'));
        this.onEdit('quote', quoteData);
      });
    });
    
    container.querySelectorAll('.edit-invoice').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const invoiceData = JSON.parse(btn.getAttribute('data-invoice'));
        this.onEdit('invoice', invoiceData);
      });
    });
    
    // Event listeners para eliminar
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
      return this.currentDocuments;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return this.currentDocuments.filter(doc => {
      const clientMatch = doc.clientName.toLowerCase().includes(searchTermLower);
      const numberMatch = doc.number.toLowerCase().includes(searchTermLower);
      const totalText = doc.total.toString();
      const totalMatch = totalText.includes(searchTermLower) || 
                        formatCurrencyRD(doc.total).toLowerCase().includes(searchTermLower);
      
      return clientMatch || numberMatch || totalMatch;
    });
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