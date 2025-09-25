// src/components/documents/DocumentForm.js
import { Modal } from '../ui/Modal.js';
import { ClientService } from '../../data/firebaseService.js';
import { QuoteService, InvoiceService } from '../../data/firebaseService.js';

export class DocumentForm {
  constructor(type, onSubmit) {
    this.type = type;
    this.onSubmit = onSubmit;
    this.modal = new Modal();
  }
  
  async show() {
    const title = this.type === 'quote' ? 'Nueva Cotización' : 'Nueva Factura';
    
    try {
      const clients = await ClientService.getAll();
      const clientsOptions = clients.map(client => 
        `<option value="${client.id}">${client.name}</option>`
      ).join('');
      
      const formHTML = `
        <form id="document-form" class="space-y-6">
          <input type="hidden" id="document-type" value="${this.type}">
          <div id="document-error-message" class="text-red-500 text-sm hidden"></div>
          
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
        
        const selectExistingBtn = document.querySelector('.select-existing');
        const createNewBtn = document.querySelector('.create-new');
        
        if (selectExistingBtn) {
          selectExistingBtn.addEventListener('click', () => {
            document.getElementById('existing-client-section').classList.remove('hidden');
            document.getElementById('new-client-section').classList.add('hidden');
          });
        }
        
        if (createNewBtn) {
          createNewBtn.addEventListener('click', () => {
            document.getElementById('existing-client-section').classList.add('hidden');
            document.getElementById('new-client-section').classList.remove('hidden');
          });
        }
        
        this.addItem();
        
        const addItemBtn = document.getElementById('add-item');
        if (addItemBtn) {
          addItemBtn.addEventListener('click', () => {
            this.addItem();
          });
        }
        
        const form = document.getElementById('document-form');
        if (form) {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(modal);
          });
        }
      });
    } catch (error) {
      console.error('Error al mostrar formulario de documento:', error);
      alert('Error al cargar el formulario: ' + error.message);
    }
  }
  
  addItem() {
    const container = document.getElementById('items-container');
    if (!container) return;
    
    const itemIndex = container.children.length;
    
    const itemHTML = `
      <div class="item-row flex space-x-3 p-3 bg-white rounded border">
        <div class="flex-1">
          <input type="text" class="form-control item-description" placeholder="Descripción del servicio o producto" required>
        </div>
        <div class="w-20">
          <input type="number" class="form-control item-quantity" placeholder="1" min="1" value="1" required>
        </div>
        <div class="w-32">
          <input type="number" class="form-control item-price" placeholder="0.00" min="0" step="0.01" required>
        </div>
        <div class="w-32">
          <input type="text" class="form-control item-total" readonly>
        </div>
        <button type="button" class="btn btn-danger remove-item self-end">✕</button>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHTML);
    
    const lastItem = container.lastElementChild;
    this.setupItemListeners(lastItem, itemIndex);
  }
  
  setupItemListeners(itemElement, index) {
    const quantityInput = itemElement.querySelector('.item-quantity');
    const priceInput = itemElement.querySelector('.item-price');
    const totalInput = itemElement.querySelector('.item-total');
    const removeBtn = itemElement.querySelector('.remove-item');
    
    if (!quantityInput || !priceInput || !totalInput || !removeBtn) return;
    
    const calculateTotal = () => {
      const quantity = parseFloat(quantityInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      const total = quantity * price;
      totalInput.value = total > 0 ? `₡${total.toFixed(2)}` : '';
      this.calculateTotals();
    };
    
    quantityInput.addEventListener('input', calculateTotal);
    priceInput.addEventListener('input', calculateTotal);
    
    removeBtn.addEventListener('click', () => {
      if (itemElement.parentNode) {
        itemElement.parentNode.removeChild(itemElement);
        this.calculateTotals();
      }
    });
  }
  
  calculateTotals() {
    let subtotal = 0;
    const itemRows = document.querySelectorAll('.item-row');
    
    itemRows.forEach(row => {
      const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
      const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
      subtotal += quantity * price;
    });
    
    const iva = subtotal * 0.13;
    const total = subtotal + iva;
    
    const subtotalEl = document.getElementById('subtotal');
    const ivaEl = document.getElementById('iva');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `₡${subtotal.toFixed(2)}`;
    if (ivaEl) ivaEl.textContent = `₡${iva.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₡${total.toFixed(2)}`;
  }
  
  async handleSubmit(modal) {
    const isExistingClient = document.getElementById('existing-client-section')?.classList.contains('hidden') === false;
    let clientId, clientName;
    
    try {
      if (isExistingClient) {
        clientId = document.getElementById('existing-client')?.value;
        if (!clientId) {
          throw new Error('Por favor seleccione un cliente');
        }
        const client = await ClientService.getById(clientId);
        if (!client) {
          throw new Error('Cliente no encontrado');
        }
        clientName = client.name;
      } else {
        const newClientData = {
          name: document.getElementById('new-client-name')?.value,
          email: document.getElementById('new-client-email')?.value,
          phone: document.getElementById('new-client-phone')?.value,
          address: document.getElementById('new-client-address')?.value
        };
        
        if (!newClientData.name || !newClientData.phone) {
          throw new Error('Nombre y teléfono son requeridos');
        }
        
        const newClient = await ClientService.create(newClientData);
        clientId = newClient.id;
        clientName = newClient.name;
      }
      
      const items = [];
      const itemRows = document.querySelectorAll('.item-row');
      let hasValidItem = false;
      
      itemRows.forEach(row => {
        const description = row.querySelector('.item-description')?.value;
        const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        
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
        throw new Error('Por favor agregue al menos un item válido');
      }
      
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const iva = subtotal * 0.13;
      const total = subtotal + iva;
      
      const documentData = {
        clientId,
        clientName,
        date: document.getElementById('document-date')?.value,
        items,
        subtotal,
        iva,
        total
      };
      
      if (this.type === 'quote') {
        await QuoteService.create(documentData);
      } else {
        await InvoiceService.create(documentData);
      }
      
      this.onSubmit();
      modal.close();
    } catch (error) {
      console.error('Error al guardar documento:', error);
      const errorDiv = document.getElementById('document-error-message');
      if (errorDiv) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      } else {
        alert('Error: ' + error.message);
      }
    }
  }
}