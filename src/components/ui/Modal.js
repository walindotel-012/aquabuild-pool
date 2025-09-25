// src/components/ui/Modal.js
export class Modal {
  constructor() {
    this.element = null;
  }
  
  show(title, content, confirmText = 'Confirmar', onShow = null) {
    this.element = document.createElement('div');
    this.element.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    this.element.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
          <button class="close-modal text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          ${content}
        </div>
        <div class="flex justify-end space-x-3 p-6 border-t">
          <button class="btn btn-outline cancel-modal">Cancelar</button>
          <button class="btn btn-primary confirm-modal">${confirmText}</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.element);
    
    // Close handlers
    this.element.querySelector('.close-modal').addEventListener('click', () => this.close());
    this.element.querySelector('.cancel-modal').addEventListener('click', () => this.close());
    
    // Prevent closing when clicking inside modal
    this.element.querySelector('div.bg-white').addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    if (onShow) {
      onShow(this);
    }
  }
  
  close() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }
  }
}