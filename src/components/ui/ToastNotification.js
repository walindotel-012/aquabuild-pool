// src/components/ui/ToastNotification.js
export class ToastNotification {
  constructor() {
    this.toastContainer = null;
    this.init();
  }
  
  init() {
    // Crear contenedor de toasts
    this.toastContainer = document.createElement('div');
    this.toastContainer.id = 'toast-container';
    this.toastContainer.className = 'fixed z-50 pointer-events-none';
    
    // Estilos para desktop y mobile
    const style = document.createElement('style');
    style.textContent = `
      #toast-container {
        top: 20px;
        right: 20px;
      }
      
      @media (max-width: 768px) {
        #toast-container {
          top: auto;
          bottom: 20px;
          right: 20px;
          left: 20px;
        }
      }
      
      .toast {
        @apply pointer-events-auto flex items-center p-4 mb-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform;
        animation: toastSlideIn 0.3s ease-out, toastFadeIn 0.3s ease-out;
        max-width: 400px;
      }
      
      @media (max-width: 768px) {
        .toast {
          max-width: none;
          width: calc(100% - 40px);
        }
      }
      
      .toast-success { @apply bg-green-600; }
      .toast-error { @apply bg-red-600; }
      .toast-warning { @apply bg-yellow-600 text-gray-900; }
      .toast-info { @apply bg-blue-600; }
      
      .toast-icon {
        @apply mr-3 flex-shrink-0;
        width: 20px;
        height: 20px;
      }
      
      .toast-content {
        @apply flex-1 min-w-0;
      }
      
      .toast-message {
        @apply text-sm break-words;
      }
      
      .toast-close {
        @apply ml-3 flex-shrink-0 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-current rounded-full;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes toastSlideIn {
        from {
          transform: translateY(-20px) translateX(100px);
        }
        to {
          transform: translateY(0) translateX(0);
        }
      }
      
      @media (max-width: 768px) {
        @keyframes toastSlideIn {
          from {
            transform: translateY(20px) translateX(0);
          }
          to {
            transform: translateY(0) translateX(0);
          }
        }
      }
      
      @keyframes toastFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .toast-exit {
        animation: toastSlideOut 0.2s ease-in forwards, toastFadeOut 0.2s ease-in forwards;
      }
      
      @keyframes toastSlideOut {
        from {
          transform: translateY(0) translateX(0);
        }
        to {
          transform: translateY(-20px) translateX(100px);
        }
      }
      
      @media (max-width: 768px) {
        @keyframes toastSlideOut {
          from {
            transform: translateY(0) translateX(0);
          }
          to {
            transform: translateY(20px) translateX(0);
          }
        }
      }
      
      @keyframes toastFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(this.toastContainer);
  }
  
  show(message, type = 'info', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    const icon = this.getIcon(type);
    const closeBtn = this.createCloseButton();
    
    toast.innerHTML = `
      ${icon}
      <div class="toast-content">
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      ${closeBtn.outerHTML}
    `;
    
    this.toastContainer.appendChild(toast);
    
    // Manejar cierre automático
    const timeoutId = setTimeout(() => {
      this.removeToast(toast);
    }, duration);
    
    // Manejar cierre manual
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      clearTimeout(timeoutId);
      this.removeToast(toast);
    });
    
    // Soporte de teclado
    closeButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clearTimeout(timeoutId);
        this.removeToast(toast);
      }
    });
    
    return toast;
  }
  
  success(message, duration = 5000) {
    return this.show(message, 'success', duration);
  }
  
  error(message, duration = 7000) {
    return this.show(message, 'error', duration);
  }
  
  warning(message, duration = 6000) {
    return this.show(message, 'warning', duration);
  }
  
  info(message, duration = 5000) {
    return this.show(message, 'info', duration);
  }
  
  getIcon(type) {
    const icons = {
      success: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
      error: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
      warning: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
      info: '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    };
    return icons[type] || icons.info;
  }
  
  createCloseButton() {
    const button = document.createElement('button');
    button.className = 'toast-close';
    button.setAttribute('aria-label', 'Cerrar notificación');
    button.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    return button;
  }
  
  removeToast(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Instancia global para uso en toda la aplicación
export const toast = new ToastNotification();