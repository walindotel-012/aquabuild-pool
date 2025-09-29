// src/components/clients/ClientList.js
import { Toast } from '../ui/Toast.js';
import { ClientService } from '../../data/firebaseService.js';

export class ClientList {
  constructor(onEdit, onDelete) {
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }
  
  // render() ahora devuelve una PROMESA
  async render() {
    try {
      const clients = await ClientService.getAll();
      
      const container = document.createElement('div');
      container.className = 'card';
      
      if (clients.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8">
            <p class="text-gray-500">No hay clientes registrados</p>
          </div>
        `;
        return container; // ← Devuelve el elemento DOM
      }
      
      const sortedClients = clients.sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      
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
              ${sortedClients.map(client => `
                <tr>
                  <td class="font-mono text-xs">${client.id.substring(0, 8)}</td>
                  <td class="font-medium">${this.escapeHtml(client.name)}</td>
                  <td>${client.email || '-'}</td>
                  <td>${client.phone || '-'}</td>
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
      
      container.querySelectorAll('.edit-client').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          const client = clients.find(c => c.id === id);
          if (client) {
            this.onEdit(client);
          }
        });
      });
      
      container.querySelectorAll('.delete-client').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          if (confirm('¿Está seguro de eliminar este cliente?')) {
            this.handleDelete(id);
          }
        });
      });
      
      return container; // ← Devuelve el elemento DOM
    } catch (error) {
      console.error('Error al renderizar lista de clientes:', error);
      Toast.showError('Error al cargar los clientes');
      const container = document.createElement('div');
      container.className = 'card';
      container.innerHTML = `
        <div class="text-center py-8">
          <p class="text-red-500">Error al cargar los clientes</p>
          <button class="btn btn-primary mt-4 refresh-clients">Reintentar</button>
        </div>
      `;
      
      container.querySelector('.refresh-clients').addEventListener('click', () => {
        this.onDelete();
      });
      
      return container; // ← Siempre devuelve un elemento DOM
    }
  }
  
  async handleDelete(id) {
    try {
      await ClientService.delete(id);
      Toast.show('¡Cliente eliminado exitosamente!');
      this.onDelete();
    } catch (error) {
      Toast.showError('Error al eliminar cliente: ' + error.message);
    }
  }
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}