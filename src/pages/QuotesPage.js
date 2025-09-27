// src/pages/QuotesPage.js
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
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre de cliente</label>
          <input type="text" id="search-client-quote" class="form-control" placeholder="Escriba el nombre del cliente...">
        </div>
        <div class="flex items-end">
          <button id="clear-filters-quote" class="btn btn-outline w-full">Limpiar Filtros</button>
        </div>
      </div>
    `;
    
    container.appendChild(header);
    
    const documentList = new DocumentList('quote', 
      () => this.refresh(), 
      (document) => this.documentForm.show(document)
    );
    container.appendChild(documentList.render());
    
    setTimeout(() => {
      document.getElementById('new-quote-btn')?.addEventListener('click', () => {
        this.documentForm.show();
      });
      
      const searchInput = document.getElementById('search-client-quote');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          // Implementación de búsqueda
        });
      }
      
      document.getElementById('clear-filters-quote')?.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
        }
        this.refresh();
      });
    }, 100);
    
    return container;
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
