import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class QuotesPage {
  constructor() {
    this.documentForm = new DocumentForm('quote', () => this.refresh());
    this.documentList = null;
    this.isInitialized = false;
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-8 pb-8';
    
    const header = document.createElement('div');
    header.className = 'space-y-6';
    header.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Cotizaciones</h2>
          <p class="text-gray-600">Crea propuestas elegantes, lleva un control de aprobaciones y conviértelas en facturas al instante.</p>
        </div>
        <button id="new-quote-btn" class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Cotización
        </button>
      </div>
      
      <div class="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <label class="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Buscar</label>
        <div class="flex flex-col md:flex-row gap-3">
          <input type="text" id="search-quote" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Cliente, número o monto...">
          <div class="flex gap-2 flex-wrap">
            <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">PDF disponibles</button>
            <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Numeración automática</button>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(header);
    
    this.documentList = new DocumentList('quote', () => this.refresh());
    this.documentList.setOnEditCallback((type, document) => {
      this.documentForm.show(document);
    });
    container.appendChild(this.documentList.render());
    
    // Configurar eventos solo una vez
    if (!this.isInitialized) {
      setTimeout(() => {
        const newQuoteBtn = document.getElementById('new-quote-btn');
        if (newQuoteBtn && !newQuoteBtn.hasEventListeners) {
          newQuoteBtn.addEventListener('click', () => {
            this.documentForm.show();
          });
          newQuoteBtn.hasEventListeners = true;
        }
        
        const searchInput = document.getElementById('search-quote');
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
      const container = document.querySelector('#page-content > div:nth-child(2)');
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