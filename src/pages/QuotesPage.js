import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class QuotesPage {
  constructor() {
    this.documentForm = new DocumentForm('quote', () => this.refresh());
    this.documentList = null;
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
      
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por cliente, número o monto</label>
          <input type="text" id="search-quote" class="form-control" placeholder="Ej: Juan Pérez, COT-0001, 50000">
        </div>
      </div>
    `;
    
    container.appendChild(header);
    
    this.documentList = new DocumentList('quote', () => this.refresh());
    this.documentList.setOnEditCallback((type, document) => {
      this.documentForm.show(document);
    });
    container.appendChild(this.documentList.render());
    
    setTimeout(() => {
      document.getElementById('new-quote-btn')?.addEventListener('click', () => {
        this.documentForm.show();
      });
      
      // Evento de búsqueda en tiempo real
      const searchInput = document.getElementById('search-quote');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.handleSearch(e.target.value);
        });
      }
    }, 100);
    
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
    const container = this.render();
    const currentContainer = document.querySelector('#page-content');
    if (currentContainer) {
      currentContainer.innerHTML = '';
      currentContainer.appendChild(container);
    }
  }
}