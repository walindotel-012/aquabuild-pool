// src/components/ui/Toast.js
export class Toast {
  static show(message, type = 'success', duration = 3000) {
    // Eliminar toasts anteriores
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Crear contenedor del toast
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: #16a34a;
      font-weight: bold;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      min-width: 280px;
      max-width: 90%;
      text-align: center;
      font-size: 16px;
      border: 2px solid #16a34a;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Ocultar después de la duración especificada
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);
  }
  
  static showError(message, duration = 3000) {
    const existingToast = document.getElementById('toast-notification');
    if (existingToast) {
      existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      color: #dc2626;
      font-weight: bold;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      min-width: 280px;
      max-width: 90%;
      text-align: center;
      font-size: 16px;
      border: 2px solid #dc2626;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, duration);
  }
}