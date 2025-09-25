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
    header.className = 'flex justify-between items-center';
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h2>
      <button id="new-quote-btn" class="btn btn-primary">+ Nueva Cotización</button>
    `;
    
    container.appendChild(header);
    
    const documentList = new DocumentList('quote', () => this.refresh());
    container.appendChild(documentList.render());
    
    // Asegurar que el evento se agregue después de que el elemento esté en el DOM
    setTimeout(() => {
      const newQuoteBtn = document.getElementById('new-quote-btn');
      if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => {
          this.documentForm.show();
        });
      }
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