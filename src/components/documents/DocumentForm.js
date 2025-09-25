// src/components/documents/DocumentForm.js
import { Modal } from '../ui/Modal.js';
import { ClientService } from '../../data/firebaseService.js';
import { QuoteService, InvoiceService } from '../../data/firebaseService.js';

export class DocumentForm {
  constructor(type, onSubmit) {
    this.type = type;
    this.onSubmit = onSubmit;
    this.modal = new Modal();
    this.items = [];
  }
  
  async show() {
    const title = this.type === 'quote' ? 'Nueva Cotización' : 'Nueva Factura';
    
    // Cargar clientes para el select
    const clients = await ClientService.getAll();
    const clientsOptions = clients.map(client => 
      `<option value="${client.id}">${client.name}</option>`
    ).join('');
    
    const formHTML = `
      <form id="document-form" class="space-y-6">
        <input type="hidden" id="document-type" value="${this.type}">
        
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">Cliente *</label>
          <div class="flex space-x-3 mb-3">
            <button type="button" class="btn btn-outline select-existing">Seleccionar Existente</button>
            <button type="button" class="btn btn-outline create-new">Crear Nuevo</button>
          </div>
          
          <div id="existing-client-section">
            <select id="existing-client" class="form-control">
              <option value="">Seleccione un cliente</option>
              ${clientsOptions}
            </select>
          </div>
          
          <div id="new-client-section" class="hidden space-y-3">
            <input type="text" id="new-client-name" class="form-control" placeholder="Nombre completo *" required>
            <input type="email" id="new-client-email" class="form-control" placeholder="Email">
            <input type="tel" id="new-client-phone" class="form-control" placeholder="Teléfono *" required>
            <input type="text" id="new-client-address" class="form-control" placeholder="Dirección">
          </div>
        </div>
        
        <div>
          <label for="document-date" class="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
          <input type="date" id="document-date" class="form-control" required>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Items</label>
          <div id="items-container" class="space-y-3"></div>
          <button type="button" id="add-item" class="btn btn-success mt-2">+ Agregar Item</button>
        </div>
        
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-end space-y-2 flex-col">
            <div class="flex justify-between">
              <span class="font-medium">Subtotal:</span>
              <span id="subtotal">₡0.00</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">IVA (13%):</span>
              <span id="iva">₡0.00</span>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-200">
              <span class="font-bold text-lg">Total:</span>
              <span id="total" class="font-bold text-lg text-blue-600">₡0.00</span>
            </div>
          </div>
        </div>
      </form>
    `;
    
    this.modal.show(title, formHTML, 'Guardar', (modal) => {
      document.getElementById('document-date').valueAsDate = new Date();
      document.querySelector('.select-existing').addEventListener('click', () => {
        document.getElementById('existing-client-section').classList.remove('hidden');
        document.getElementById('new-client-section').classList.add('hidden');
      });
      document.querySelector('.create-new').addEventListener('click', () => {
        document.getElementById('existing-client-section').classList.add('hidden');
        document.getElementById('new-client-section').classList.remove('hidden');
      });
      this.addItem();
      document.getElementById('add-item').addEventListener('click', () => {
        this.addItem();
      });
      document.getElementById('document-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit(modal);
      });
    });
  }
  
  // ... (mantén los métodos addItem, setupItemListeners, calculateTotals igual que antes)
  
  async handleSubmit(modal) {
    const isExistingClient = !document.getElementById('existing-client-section').classList.contains('hidden');
    let clientId, clientName;
    
    if (isExistingClient) {
      clientId = document.getElementById('existing-client').value;
      if (!clientId) {
        alert('Por favor seleccione un cliente');
        return;
      }
      const client = await ClientService.getById(clientId);
      clientName = client.name;
    } else {
      const newClientData = {
        name: document.getElementById('new-client-name').value,
        email: document.getElementById('new-client-email').value,
        phone: document.getElementById('new-client-phone').value,
        address: document.getElementById('new-client-address').value
      };
      if (!newClientData.name || !newClientData.phone) {
        alert('Nombre y teléfono son requeridos');
        return;
      }
      const newClient = await ClientService.create(newClientData);
      clientId = newClient.id;
      clientName = newClient.name;
    }
    
    const items = [];
    const itemRows = document.querySelectorAll('.item-row');
    let hasValidItem = false;
    
    itemRows.forEach(row => {
      const description = row.querySelector('.item-description').value;
      const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
      const price = parseFloat(row.querySelector('.item-price').value) || 0;
      if (description && quantity > 0 && price > 0) {
        items.push({
          description,
          quantity,
          price,
          total: quantity * price
        });
        hasValidItem = true;
      }
    });
    
    if (!hasValidItem) {
      alert('Por favor agregue al menos un item válido');
      return;
    }
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const iva = subtotal * 0.13;
    const total = subtotal + iva;
    
    const documentData = {
      clientId,
      clientName,
      date: document.getElementById('document-date').value,
      items,
      subtotal,
      iva,
      total
    };
    
    try {
      if (this.type === 'quote') {
        await QuoteService.create(documentData);
      } else {
        await InvoiceService.create(documentData);
      }
      this.onSubmit();
      modal.close();
    } catch (error) {
      alert('Error al guardar el documento: ' + error.message);
    }
  }
}