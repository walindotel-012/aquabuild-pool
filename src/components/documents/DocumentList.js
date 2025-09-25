// src/components/documents/DocumentList.js
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
                <div class="flex space-x-2">
                  <button class="btn btn-warning btn-sm print-quote" data-id="${doc.id}">Imprimir</button>
                  <button class="btn btn-danger btn-sm delete-doc" data-id="${doc.id}">Eliminar</button>
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
                <div class="flex space-x-2">
                  <button class="btn btn-warning btn-sm print-invoice" data-id="${doc.id}">Imprimir</button>
                  <button class="btn btn-danger btn-sm delete-doc" data-id="${doc.id}">Eliminar</button>
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
            }
          } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF');
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
            }
          } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el PDF');
          }
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
      
    } catch (error) {
      console.error('Error al cargar documentos:', error);
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
  
  async handleDelete(id) {
    try {
      if (this.type === 'quote') {
        await QuoteService.delete(id);
      } else {
        await InvoiceService.delete(id);
      }
      this.onDelete();
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  }
}