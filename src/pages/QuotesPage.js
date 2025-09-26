import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class QuotesPage {
  constructor() {
    this.documentForm = new DocumentForm('quote', () => this.refresh());
    this.debounceTimer = null;
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
   const header = document.createElement('div');
header.className = 'flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4';
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
    
    const documentList = new DocumentList('quote', () => this.refresh());
    container.appendChild(documentList.render());
    
    setTimeout(() => {
      document.getElementById('new-quote-btn')?.addEventListener('click', () => {
        this.documentForm.show();
      });
      
      // Evento de búsqueda en tiempo real
      const searchInput = document.getElementById('search-client-quote');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.filterQuotes(e.target.value);
          }, 300); // Debounce de 300ms
        });
      }
      
      // Evento para limpiar filtros
      document.getElementById('clear-filters-quote')?.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
        }
        this.filterQuotes('');
      });
    }, 100);
    
    return container;
  }
  
  filterQuotes(searchTerm) {
    const listElement = document.querySelector('#quotes-list');
    if (!listElement) return;
    
    const rows = listElement.querySelectorAll('tbody tr');
    const searchTermLower = searchTerm.toLowerCase();
    
    rows.forEach(row => {
      const clientCell = row.querySelector('td:nth-child(2)');
      if (clientCell) {
        const clientName = clientCell.textContent.toLowerCase();
        if (clientName.includes(searchTermLower)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      }
    });
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