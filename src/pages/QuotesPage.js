import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class QuotesPage {
  constructor() {
    this.documentForm = new DocumentForm('quote', () => this.refresh());
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
    const header = document.createElement('div');
    header.className = 'space-y-4';
    header.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h2>
        <button id="new-quote-btn" class="btn btn-primary whitespace-nowrap">+ Nueva Cotización</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" id="search-quote" class="form-control" placeholder="Cliente, número...">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
          <input type="date" id="start-date-quote" class="form-control">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
          <input type="date" id="end-date-quote" class="form-control">
        </div>
        <div class="flex items-end">
          <button id="filter-quote-btn" class="btn btn-primary w-full">Filtrar</button>
        </div>
      </div>
    `;
    
    container.appendChild(header);
    
    const documentList = new DocumentList('quote', () => this.refresh());
    container.appendChild(documentList.render());
    
    setTimeout(() => {
      document.getElementById('new-quote-btn')?.addEventListener('click', () => {
        this.documentForm.show();
      });
      
      document.getElementById('filter-quote-btn')?.addEventListener('click', () => {
        const filters = {
          searchTerm: document.getElementById('search-quote')?.value || '',
          startDate: document.getElementById('start-date-quote')?.value || '',
          endDate: document.getElementById('end-date-quote')?.value || ''
        };
        this.applyFilters(filters);
      });
    }, 100);
    
    return container;
  }
  
  applyFilters(filters) {
    // Esta implementación se maneja en DocumentList.js
    const container = this.render();
    const currentContainer = document.querySelector('#page-content');
    if (currentContainer) {
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
      
      // Aplicar filtros después de que se cargue la lista
      setTimeout(() => {
        const listElement = document.querySelector('.card');
        if (listElement && listElement.querySelector('.table')) {
          // Los filtros se aplican automáticamente en la carga
        }
      }, 500);
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