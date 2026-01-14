import { DocumentList } from '../components/documents/DocumentList.js';
import { DocumentForm } from '../components/documents/DocumentForm.js';

export class QuotesPage {
  constructor() {
    this.documentForm = new DocumentForm('quote', () => this.refresh());
    this.documentList = null;
    this.isInitialized = false;
    this.containerElement = null;
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-8 pb-8';
    this.containerElement = container;
    
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
        <label class="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Filtrar</label>
        <div class="flex flex-col md:flex-row gap-3">
          <input type="text" id="search-quote" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Cliente, número o monto...">
          <select id="filter-status" class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium">
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
          </select>
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
    const docListElement = this.documentList.render();
    container.appendChild(docListElement);
    
    // Configurar eventos después de crear el DOM
    this.setupEventListeners();
    
    return container;
  }

  setupEventListeners() {
    const newQuoteBtn = this.containerElement?.querySelector('#new-quote-btn');
    if (newQuoteBtn && !newQuoteBtn.hasEventListeners) {
      newQuoteBtn.addEventListener('click', () => {
        this.documentForm.show();
      });
      newQuoteBtn.hasEventListeners = true;
    }
    
    const searchInput = this.containerElement?.querySelector('#search-quote');
    if (searchInput && !searchInput.hasEventListeners) {
      searchInput.addEventListener('input', () => {
        this.applyFilters();
      });
      searchInput.hasEventListeners = true;
    }

    const statusFilter = this.containerElement?.querySelector('#filter-status');
    if (statusFilter && !statusFilter.hasEventListeners) {
      statusFilter.addEventListener('change', () => {
        this.applyFilters();
      });
      statusFilter.hasEventListeners = true;
    }
  }

  applyFilters() {
    if (!this.documentList || !this.documentList.currentDocuments) {
      return;
    }

    const searchTerm = this.containerElement?.querySelector('#search-quote')?.value || '';
    const statusValue = this.containerElement?.querySelector('#filter-status')?.value || '';
    
    let filteredDocuments = [...this.documentList.currentDocuments];
    
    // Filtrar por búsqueda de texto
    if (searchTerm) {
      filteredDocuments = this.documentList.filterDocuments(searchTerm);
    }
    
    // Filtrar por estado
    if (statusValue) {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === statusValue);
    }
    
    // Renderizar tabla filtrada
    const tableContainer = this.containerElement?.querySelector('.card:nth-child(2)');
    if (tableContainer) {
      this.documentList.renderDocuments(tableContainer, filteredDocuments);
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