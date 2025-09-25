// src/components/clients/ClientForm.js
import { Modal } from '../ui/Modal.js';
import { ClientService } from '../../data/firebaseService.js';

export class ClientForm {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.modal = new Modal();
  }
  
  show(client = null) {
    const title = client ? 'Editar Cliente' : 'Nuevo Cliente';
    const formHTML = `
      <form id="client-form" class="space-y-4">
        <input type="hidden" id="client-id">
        <div>
          <label for="client-name" class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
          <input type="text" id="client-name" class="form-control" required>
        </div>
        <div>
          <label for="client-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="client-email" class="form-control">
        </div>
        <div>
          <label for="client-phone" class="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
          <input type="tel" id="client-phone" class="form-control" required>
        </div>
        <div>
          <label for="client-address" class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <input type="text" id="client-address" class="form-control">
        </div>
      </form>
    `;
    
    this.modal.show(title, formHTML, 'Guardar Cliente', (modal) => {
      if (client) {
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-name').value = client.name;
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-phone').value = client.phone;
        document.getElementById('client-address').value = client.address || '';
      }
      
      document.getElementById('client-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit(modal);
      });
    });
  }
  
  async handleSubmit(modal) {
    const id = document.getElementById('client-id').value;
    const clientData = {
      name: document.getElementById('client-name').value,
      email: document.getElementById('client-email').value,
      phone: document.getElementById('client-phone').value,
      address: document.getElementById('client-address').value
    };
    
    try {
      if (id) {
        await ClientService.update(id, clientData);
      } else {
        await ClientService.create(clientData);
      }
      this.onSubmit();
      modal.close();
    } catch (error) {
      alert('Error al guardar el cliente: ' + error.message);
    }
  }
}