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
    
    // Header with button
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center';
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Cotizaciones</h2>
      <button id="new-quote-btn" class="btn btn-primary">+ Nueva Cotización</button>
    `;
    
    container.appendChild(header);
    
    // Document list
    this.documentList = new DocumentList('quote', () => this.refresh());
    container.appendChild(this.documentList.render());
    
    // Add event listener to new quote button
    container.querySelector('#new-quote-btn').addEventListener('click', () => {
      this.documentForm.show();
    });
    
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