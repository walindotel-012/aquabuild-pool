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

  static confirmDelete(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm';
      overlay.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in">
          <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 4v2M6.343 3L3 6.343m0 11.314L6.343 21m11.314 0l3.343-3.343m0-11.314l-3.343-3.343"/>
            </svg>
          </div>
          
          <h3 class="text-lg font-bold text-center text-gray-900 mb-2">¿Está seguro?</h3>
          <p class="text-center text-gray-600 mb-6">${message}</p>
          
          <div class="flex gap-3">
            <button class="modal-cancel flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200">
              Cancelar
            </button>
            <button class="modal-confirm flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Eliminar
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      const cancelBtn = overlay.querySelector('.modal-cancel');
      const confirmBtn = overlay.querySelector('.modal-confirm');
      
      const cleanup = () => {
        overlay.remove();
      };
      
      cancelBtn.addEventListener('click', () => {
        cleanup();
        resolve(false);
      });
      
      confirmBtn.addEventListener('click', () => {
        cleanup();
        resolve(true);
      });
      
      // Cerrar al hacer clic fuera del modal
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup();
          resolve(false);
        }
      });
      
      // ESC key
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', handleEsc);
          cleanup();
          resolve(false);
        }
      };
      document.addEventListener('keydown', handleEsc);
    });
  }
}