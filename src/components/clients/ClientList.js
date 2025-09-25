// src/components/clients/ClientList.js
import { ClientService } from '../../data/firebaseService.js';

export class ClientList {
  constructor(onEdit, onDelete) {
    this.onEdit = onEdit;
    this.onDelete = onDelete;
  }
  
  // render() ahora devuelve un elemento DOM inmediatamente
  render() {
    const container = document.createElement('div');
    container.className = 'card';
    
    // Mostrar spinner de carga inicialmente
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando clientes...</p>
      </div>
    `;
    
    // Cargar los datos asíncronamente
    this.loadClients(container);
    
    return container;
  }
  
  async loadClients(container) {
    try {
      const clients = await ClientService.getAll();
      
      if (clients.length === 0) {
        container.innerHTML = `
          <div class="text-center py-8">
            <p class="text-gray-500">No hay clientes registrados</p>
          </div>
        `;
        return;
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
      
      // Agregar event listeners
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
      
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      container.innerHTML = `
        <div class="text-center py-8">
          <p class="text-red-500">Error al cargar los clientes</p>
          <button class="btn btn-primary mt-4 retry-button">Reintentar</button>
        </div>
      `;
      
      container.querySelector('.retry-button').addEventListener('click', () => {
        this.loadClients(container);
      });
    }
  }
  
  async handleDelete(id) {
    try {
      await ClientService.delete(id);
      this.onDelete();
    } catch (error) {
      alert('Error al eliminar cliente: ' + error.message);
    }
  }
  
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}