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
    
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center';
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
      <button id="new-client-btn" class="btn btn-primary">+ Nuevo Cliente</button>
    `;
    
    container.appendChild(header);
    
    this.clientList = new ClientList(
      (client) => this.clientForm.show(client),
      () => this.refresh()
    );
    container.appendChild(this.clientList.render());
    
    container.querySelector('#new-client-btn').addEventListener('click', () => {
      this.clientForm.show();
    });
    
    return container;
  }
  
  async refresh() {
    // Recargar datos desde Firebase
    const container = this.render();
    const currentContainer = document.querySelector('#page-content');
    if (currentContainer) {
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
    }
  }
}