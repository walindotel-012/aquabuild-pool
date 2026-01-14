// src/pages/ClientsPage.js
import { ClientList } from '../components/clients/ClientList.js';
import { ClientForm } from '../components/clients/ClientForm.js';

export class ClientsPage {
  constructor() {
    this.clientForm = new ClientForm(() => this.refresh());
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
    // Header con botón
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center';
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
      <button id="new-client-btn" class="btn btn-primary">+ Nuevo Cliente</button>
    `;
    
    container.appendChild(header);
    
    // Mostrar spinner mientras carga
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'clients-loading';
    loadingDiv.innerHTML = `
      <div class="card text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando clientes...</p>
      </div>
    `;
    container.appendChild(loadingDiv);
    
    // Cargar la lista de clientes asíncronamente
    this.loadClientList(loadingDiv);
    
    // Agregar evento al botón nuevo cliente
    setTimeout(() => {
      const newClientBtn = document.getElementById('new-client-btn');
      if (newClientBtn) {
        newClientBtn.addEventListener('click', () => {
          this.clientForm.show();
        });
      }
    }, 100);
    
    return container; // ← Esto devuelve un elemento DOM, NO una promesa
  }
  
  async loadClientList(loadingDiv) {
    try {
      const clientList = new ClientList(
        (client) => this.clientForm.show(client),
        () => this.refresh()
      );
      
      // ClientList.render() ahora devuelve una promesa, así que esperamos
      const listElement = await clientList.render();
      loadingDiv.parentNode.replaceChild(listElement, loadingDiv);
    } catch (error) {
      console.error('Error al cargar lista de clientes:', error);
      loadingDiv.innerHTML = `
        <div class="card text-center py-8">
          <p class="text-red-500">Error al cargar clientes</p>
          <button class="btn btn-primary mt-4" id="retry-clients">Reintentar</button>
        </div>
      `;
      document.getElementById('retry-clients')?.addEventListener('click', () => {
        this.refresh();
      });
    }
  }
  
  refresh() {
    const container = this.render();
    const currentContainer = document.querySelector('#page-content');
    if (currentContainer) {
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
    }
  }
}