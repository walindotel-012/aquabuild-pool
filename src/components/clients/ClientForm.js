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
        <div id="error-message" class="text-red-500 text-sm hidden"></div>
      </form>
    `;
    
    this.modal.show(title, formHTML, 'Guardar Cliente', (modal) => {
      const errorDiv = document.getElementById('error-message');
      
      if (client) {
        document.getElementById('client-id').value = client.id;
        document.getElementById('client-name').value = client.name;
        document.getElementById('client-email').value = client.email || '';
        document.getElementById('client-phone').value = client.phone;
        document.getElementById('client-address').value = client.address || '';
      }
      
      const saveButton = modal.element.querySelector('.confirm-modal');
      if (saveButton) {
        saveButton.onclick = async () => {
          await this.handleSave(modal, client);
        };
      }
    });
  }
  
  async handleSave(modal, editingClient = null) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.classList.add('hidden');
      errorDiv.textContent = '';
    }
    
    try {
      const id = document.getElementById('client-id').value;
      const name = document.getElementById('client-name').value.trim();
      const email = document.getElementById('client-email').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const address = document.getElementById('client-address').value.trim();
      
      // Validación básica
      if (!name) {
        this.showError('Por favor ingrese el nombre completo');
        return;
      }
      
      if (!phone) {
        this.showError('Por favor ingrese el teléfono');
        return;
      }
      
      // Validación de duplicados (solo para nuevos clientes)
      if (!id) {
        const existingClients = await ClientService.getAll();
        
        // Verificar duplicados por teléfono
        const phoneExists = existingClients.some(client => 
          client.phone === phone
        );
        
        if (phoneExists) {
          this.showError('Ya existe un cliente con este número de teléfono');
          return;
        }
        
        // Verificar duplicados por email (si se proporciona)
        if (email) {
          const emailExists = existingClients.some(client => 
            client.email && client.email.toLowerCase() === email.toLowerCase()
          );
          
          if (emailExists) {
            this.showError('Ya existe un cliente con este email');
            return;
          }
        }
        
        // Verificar duplicados por nombre (opcional, más flexible)
        const nameExists = existingClients.some(client => 
          client.name.toLowerCase() === name.toLowerCase()
        );
        
        // Puedes decidir si quieres bloquear por nombre o no
        // if (nameExists) {
        //   this.showError('Ya existe un cliente con este nombre');
        //   return;
        // }
      }
      
      const clientData = {
        name,
        email: email || '',
        phone,
        address: address || ''
      };
      
      if (id) {
        await ClientService.update(id, clientData);
      } else {
        await ClientService.create(clientData);
      }
      
      this.onSubmit();
      modal.close();
      
    } catch (error) {
      console.error('Error en handleSave:', error);
      this.showError(error.message || 'Error al guardar el cliente');
    }
  }
  
  showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.classList.remove('hidden');
    }
  }
}