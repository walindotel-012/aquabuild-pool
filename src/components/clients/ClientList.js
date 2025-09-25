// src/components/clients/ClientList.js
import { ClientService } from '../../data/clients.js';
import { DocumentService } from '../../data/documents.js';

export class ClientList {
  constructor(onEdit, onDelete) {
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }
  
  render() {
    const clients = ClientService.getAll();
    const container = document.createElement('div');
    container.className = 'card';
    
    if (clients.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <p class="text-gray-500">No hay clientes registrados</p>
        </div>
      `;
      return container;
    }
    
    const tableHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(client => `
              <tr>
                <td class="font-mono text-xs">${client.id.substring(0, 8)}</td>
                <td class="font-medium">${client.name}</td>
                <td>${client.email || '-'}</td>
                <td>${client.phone}</td>
                <td>${client.address || '-'}</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="btn btn-warning btn-sm edit-client" data-id="${client.id}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-client" data-id="${client.id}">Eliminar</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    container.innerHTML = tableHTML;
    
    // Add event listeners
    container.querySelectorAll('.edit-client').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const client = ClientService.getById(id);
        this.onEdit(client);
      });
    });
    
    container.querySelectorAll('.delete-client').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('¿Está seguro de eliminar este cliente? Se eliminarán también sus cotizaciones y facturas.')) {
          // Delete related documents
          const quotes = DocumentService.getQuotes().filter(q => q.clientId !== id);
          const invoices = DocumentService.getInvoices().filter(i => i.clientId !== id);
          localStorage.setItem('quotes', JSON.stringify(quotes));
          localStorage.setItem('invoices', JSON.stringify(invoices));
          
          if (ClientService.delete(id)) {
            this.onDelete();
          }
        }
      });
    });
    
    return container;
  }
}