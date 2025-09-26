import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class InvoicesPage {
  constructor() {
    this.documentForm = new DocumentForm('invoice', () => this.refresh());
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
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" id="search-invoice" class="form-control" placeholder="Cliente, número...">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
          <input type="date" id="start-date-invoice" class="form-control">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
          <input type="date" id="end-date-invoice" class="form-control">
        </div>
        <div class="flex items-end">
          <button id="filter-invoice-btn" class="btn btn-primary w-full">Filtrar</button>
        </div>
      </div>
    `;
    
    container.appendChild(header);
    
    const documentList = new DocumentList('invoice', () => this.refresh());
    container.appendChild(documentList.render());
    
    setTimeout(() => {
      document.getElementById('new-invoice-btn')?.addEventListener('click', () => {
        this.documentForm.show();
      });
      
      document.getElementById('filter-invoice-btn')?.addEventListener('click', () => {
        const filters = {
          searchTerm: document.getElementById('search-invoice')?.value || '',
          startDate: document.getElementById('start-date-invoice')?.value || '',
          endDate: document.getElementById('end-date-invoice')?.value || ''
        };
        this.applyFilters(filters);
      });
    }, 100);
    
    return container;
  }
  
  applyFilters(filters) {
    const container = this.render();
    const currentContainer = document.querySelector('#page-content');
    if (currentContainer) {
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
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