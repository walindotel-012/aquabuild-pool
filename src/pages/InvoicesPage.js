import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class InvoicesPage {
  constructor() {
    this.documentForm = new DocumentForm('invoice', () => this.refresh());
    this.debounceTimer = null;
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
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre de cliente</label>
          <input type="text" id="search-client-invoice" class="form-control" placeholder="Escriba el nombre del cliente...">
        </div>
        <div class="flex items-end">
          <button id="clear-filters-invoice" class="btn btn-outline w-full">Limpiar Filtros</button>
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
      
      // Evento de búsqueda en tiempo real
      const searchInput = document.getElementById('search-client-invoice');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.filterInvoices(e.target.value);
          }, 300); // Debounce de 300ms
        });
      }
      
      // Evento para limpiar filtros
      document.getElementById('clear-filters-invoice')?.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
        }
        this.filterInvoices('');
      });
    }, 100);
    
    return container;
  }
  
  filterInvoices(searchTerm) {
    const listElement = document.querySelector('#invoices-list');
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