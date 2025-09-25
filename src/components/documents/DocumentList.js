// src/components/documents/DocumentList.js
import { DocumentService } from '../../data/documents.js';

export class DocumentList {
  constructor(type, onDelete) {
    this.type = type;
    this.onDelete = onDelete;
  }
  
  render() {
    const documents = this.type === 'quote' 
      ? DocumentService.getQuotes() 
      : DocumentService.getInvoices();
    
    const container = document.createElement('div');
    container.className = 'card';
    
    if (documents.length === 0) {
      const message = this.type === 'quote' 
        ? 'No hay cotizaciones registradas' 
        : 'No hay facturas registradas';
      
      container.innerHTML = `
        <div class="text-center py-8">
          <p class="text-gray-500">${message}</p>
        </div>
      `;
      return container;
    }
    
    const headers = this.type === 'quote' 
      ? '<th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th>'
      : '<th>Número</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Acciones</th>';
    
    const rows = documents.map(doc => {
      const totalFormatted = `₡${doc.total.toFixed(2)}`;
      if (this.type === 'quote') {
        const statusClass = doc.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
        return `
          <tr>
            <td class="font-mono">${doc.number}</td>
            <td class="font-medium">${doc.clientName}</td>
            <td>${doc.date}</td>
            <td class="font-medium">${totalFormatted}</td>
            <td><span class="px-2 py-1 rounded text-xs font-medium ${statusClass}">${doc.status}</span></td>
            <td>
              <div class="flex space-x-2">
                <button class="btn btn-warning btn-sm">Editar</button>
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
            <td>${doc.date}</td>
            <td class="font-medium">${totalFormatted}</td>
            <td>
              <div class="flex space-x-2">
                <button class="btn btn-warning btn-sm">Imprimir</button>
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
    
    // Add delete event listeners
    container.querySelectorAll('.delete-doc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const confirmMsg = this.type === 'quote' 
          ? '¿Está seguro de eliminar esta cotización?' 
          : '¿Está seguro de eliminar esta factura?';
        
        if (confirm(confirmMsg)) {
          let deleted = false;
          if (this.type === 'quote') {
            deleted = DocumentService.deleteQuote(id);
          } else {
            deleted = DocumentService.deleteInvoice(id);
          }
          
          if (deleted) {
            this.onDelete();
          }
        }
      });
    });
    
    return container;
  }
}