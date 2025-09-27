// src/main.js
import './styles/main.css';


// Manejo de errores globales
window.addEventListener('error', (event) => {
  console.error('Error global:', event.error);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-red-50">
        <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 class="text-xl font-bold text-red-600 mb-4">Error en la aplicación</h2>
          <p class="text-gray-700 mb-4">Se ha producido un error al cargar la aplicación.</p>
          <p class="text-sm text-gray-500 mb-4">Abre la consola del navegador (F12) para ver detalles.</p>
          <button onclick="location.reload()" class="btn btn-primary">Recargar</button>
        </div>
      </div>
    `;
  }
});

// Cargar la aplicación con manejo de errores
async function loadApp() {
  try {
    const { App } = await import('./app.js');
    new App();
  } catch (error) {
    console.error('Error al cargar la aplicación:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-red-50">
          <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 class="text-xl font-bold text-red-600 mb-4">Error de carga</h2>
            <p class="text-gray-700 mb-4">${error.message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Recargar</button>
          </div>
        </div>
      `;
    }
  }
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadApp);
} else {
  loadApp();
}

