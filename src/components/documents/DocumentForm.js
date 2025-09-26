import { Modal } from '../ui/Modal.js';
import { ClientService } from '../../data/firebaseService.js';
import { QuoteService, InvoiceService } from '../../data/firebaseService.js';
import { formatCurrencyRD } from '../../utils/helpers.js';
import { toast } from '../ui/ToastNotification.js'; 

export class DocumentForm {
  constructor(type, onSubmit) {
    this.type = type;
    this.onSubmit = onSubmit;
    this.modal = null;
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
              <button type="button" id="select-existing-client" class="btn btn-outline">Seleccionar Existente</button>
              <button type="button" id="create-new-client" class="btn btn-outline">Crear Nuevo</button>
            </div>
            
            <div id="existing-client-section">
              <select id="existing-client" class="form-control">
                <option value="">Seleccione un cliente</option>
                ${clientsOptions}
              </select>
            </div>
            
            <div id="new-client-section" class="hidden space-y-3">
              <input type="text" id="new-client-name" class="form-control" placeholder="Nombre completo *" required>
              <input type="email" id="new-client-email" class="form-control" placeholder="Email (opcional)">
              <input type="tel" id="new-client-phone" class="form-control" placeholder="Teléfono (opcional)">
              <input type="text" id="new-client-address" class="form-control" placeholder="Dirección (opcional)">
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
                <span class="font-medium">Total:</span>
                <span id="total" class="font-bold text-lg text-blue-600">RD$0.00</span>
              </div>
            </div>
          </div>
        </form>
      `;
      
      this.modal = new Modal();
      this.modal.show(title, formHTML, 'Guardar', null);
      this.setupFormEvents();
      
    } catch (error) {
      console.error('Error al mostrar formulario:', error);
      alert('Error al cargar el formulario: ' + error.message);
    }
  }
  
  setupFormEvents() {
    document.getElementById('select-existing-client')?.addEventListener('click', () => {
      document.getElementById('existing-client-section').classList.remove('hidden');
      document.getElementById('new-client-section').classList.add('hidden');
    });
    
    document.getElementById('create-new-client')?.addEventListener('click', () => {
      document.getElementById('existing-client-section').classList.add('hidden');
      document.getElementById('new-client-section').classList.remove('hidden');
    });
    
    document.getElementById('document-date').valueAsDate = new Date();
    this.addItem();
    document.getElementById('add-item')?.addEventListener('click', () => {
      this.addItem();
    });
    
    const saveButton = this.modal.element.querySelector('.confirm-modal');
    if (saveButton) {
      saveButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.handleSave();
      });
    }
  }
  
  addItem() {
    const container = document.getElementById('items-container');
    if (!container) return;
    
    const itemHTML = `
      <div class="item-row flex space-x-3 p-3 bg-white rounded border">
        <div class="w-16">
          <input type="number" class="form-control item-quantity" placeholder="1" min="1" value="1" required>
        </div>
        <div class="flex-1">
          <input type="text" class="form-control item-description" placeholder="Descripción detallada del servicio" required>
        </div>
        <div class="w-24">
          <input type="number" class="form-control item-price" placeholder="0.00" min="0" step="0.01">
        </div>
        <div class="w-24">
          <input type="text" class="form-control item-total" readonly>
        </div>
        <button type="button" class="btn btn-danger remove-item self-end">✕</button>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHTML);
    const lastItem = container.lastElementChild;
    this.setupItemListeners(lastItem);
  }
  
  setupItemListeners(itemElement) {
    const quantityInput = itemElement.querySelector('.item-quantity');
    const priceInput = itemElement.querySelector('.item-price');
    const totalInput = itemElement.querySelector('.item-total');
    const removeBtn = itemElement.querySelector('.remove-item');
    
    const calculateTotal = () => {
      const quantity = parseFloat(quantityInput.value) || 0;
      const price = parseFloat(priceInput.value) || 0;
      const total = price > 0 ? quantity * price : 0;
      totalInput.value = price > 0 ? formatCurrencyRD(total) : 'Sin precio';
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
    let total = 0;
    const itemRows = document.querySelectorAll('.item-row');
    
    itemRows.forEach(row => {
      const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
      if (price > 0) {
        const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
        total += quantity * price;
      }
    });
    
    document.getElementById('total').textContent = formatCurrencyRD(total);
  }
  
  async handleSave() {
    const errorDiv = document.getElementById('document-error-message');
    if (errorDiv) {
      errorDiv.classList.add('hidden');
      errorDiv.textContent = '';
    }
    
    try {
      const isExistingClient = !document.getElementById('existing-client-section')?.classList.contains('hidden');
      let clientId, clientName, clientPhone, clientAddress, clientEmail;
      
      if (isExistingClient) {
        clientId = document.getElementById('existing-client')?.value;
        if (!clientId) throw new Error('Por favor seleccione un cliente');
        const client = await ClientService.getById(clientId);
        if (!client) throw new Error('Cliente no encontrado');
        clientName = client.name;
        clientPhone = client.phone || '';
        clientAddress = client.address || '';
        clientEmail = client.email || '';
      } else {
        // Solo el nombre es obligatorio para clientes nuevos
        clientName = document.getElementById('new-client-name')?.value.trim();
        if (!clientName) {
          throw new Error('El nombre del cliente es requerido');
        }
        
        clientEmail = document.getElementById('new-client-email')?.value.trim() || '';
        clientPhone = document.getElementById('new-client-phone')?.value.trim() || '';
        clientAddress = document.getElementById('new-client-address')?.value.trim() || '';
        
        // Crear cliente nuevo con solo el nombre (los demás campos son opcionales)
        const newClientData = {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          address: clientAddress
        };
        
        const newClient = await ClientService.create(newClientData);
        clientId = newClient.id;
      }
      
      const items = [];
      const itemRows = document.querySelectorAll('.item-row');
      let hasValidItem = false;
      
      itemRows.forEach(row => {
        const description = row.querySelector('.item-description')?.value.trim();
        const quantity = parseFloat(row.querySelector('.item-quantity')?.value) || 0;
        const price = parseFloat(row.querySelector('.item-price')?.value) || 0;
        
        if (description && quantity > 0) {
          items.push({
            description,
            quantity,
            price: price || 0,
            total: price > 0 ? quantity * price : 0
          });
          hasValidItem = true;
        }
      });
      
      if (!hasValidItem) throw new Error('Por favor agregue al menos un item válido');
      
      const total = items.reduce((sum, item) => sum + item.total, 0);
      
      const documentData = {
        clientId,
        clientName,
        clientPhone,
        clientAddress,
        clientEmail,
        date: document.getElementById('document-date')?.value,
        items,
        total
      };
      
      if (this.type === 'quote') {
      await QuoteService.create(documentData);
      toast.success('¡Cotización creada exitosamente!');
    } else {
      await InvoiceService.create(documentData);
      toast.success('¡Factura creada exitosamente!');
    }
    
    this.onSubmit();
    this.modal.close();
      
    } catch (error) {
      console.error('Error al guardar documento:', error);
      if (errorDiv) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove('hidden');
      } else {
        alert('Error: ' + error.message);
      }
    }
  }
}