import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class InvoicesPage {
  constructor() {
    this.documentForm = new DocumentForm('invoice', () => this.refresh());
    this.documentList = null;
    this.isInitialized = false;
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
    const header = document.createElement('div');
    header.className = 'space-y-4';
    header.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Facturas</h2>
        <button id="new-invoice-btn" class="btn btn-primary whitespace-nowrap">+ Nueva Factura</button>
      </div>
      
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por cliente, número o monto</label>
          <input type="text" id="search-invoice" class="form-control" placeholder="Ej: Juan Pérez, FAC-0001, 50000">
        </div>
      </div>
    `;
    
    container.appendChild(header);
    
    this.documentList = new DocumentList('invoice', () => this.refresh());
    this.documentList.setOnEditCallback((type, document) => {
      this.documentForm.show(document);
    });
    container.appendChild(this.documentList.render());
    
    // Configurar eventos solo una vez
    if (!this.isInitialized) {
      setTimeout(() => {
        const newInvoiceBtn = document.getElementById('new-invoice-btn');
        if (newInvoiceBtn && !newInvoiceBtn.hasEventListeners) {
          newInvoiceBtn.addEventListener('click', () => {
            this.documentForm.show();
          });
          newInvoiceBtn.hasEventListeners = true;
        }
        
        const searchInput = document.getElementById('search-invoice');
        if (searchInput && !searchInput.hasEventListeners) {
          searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
          });
          searchInput.hasEventListeners = true;
        }
      }, 100);
      this.isInitialized = true;
    }
    
    return container;
  }
  
  handleSearch(searchTerm) {
    if (this.documentList && this.documentList.currentDocuments) {
      const filteredDocuments = this.documentList.filterDocuments(searchTerm);
      const container = document.querySelector('#page-content .card');
      if (container) {
        this.documentList.renderDocuments(container, filteredDocuments);
      }
    }
  }
  
  refresh() {
    this.isInitialized = false; // Reset para la próxima renderización
    const container = this.render();
    const currentContainer = document.querySelector('#page-content');
    if (currentContainer) {
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
    }
  }
}