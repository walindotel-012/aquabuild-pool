// src/pages/InvoicesPage.js
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
    header.className = 'flex justify-between items-center';
    header.innerHTML = `
      <h2 class="text-2xl font-bold text-gray-800">Gestión de Facturas</h2>
      <button id="new-invoice-btn" class="btn btn-primary">+ Nueva Factura</button>
    `;
    
    container.appendChild(header);
    
    const documentList = new DocumentList('invoice', () => this.refresh());
    container.appendChild(documentList.render());
    
    container.querySelector('#new-invoice-btn').addEventListener('click', () => {
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