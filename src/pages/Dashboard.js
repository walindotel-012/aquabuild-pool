import { ClientService } from '../data/firebaseService.js';
import { QuoteService } from '../data/firebaseService.js';
import { InvoiceService } from '../data/firebaseService.js';

export class Dashboard {
  constructor(currentUser = null) {
    this.currentUser = currentUser;
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-8 pb-8';
    
    // Mostrar spinner de carga inicial
    container.innerHTML = `
      <!-- Tarjeta personalizada de bienvenida -->
      <div class="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">HOLA, WUARLIN DOTEL</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Tu operación avanza con 97 clientes activos</h2>
        <p class="text-gray-600 text-base mb-6 leading-relaxed">Continúa impulsando tu negocio con documentos profesionales, reportes claros y flujos de trabajo fluidos.</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button id="create-quote-btn" class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Crear cotización
          </button>
          <button id="view-clients-btn" class="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Ver clientes
          </button>
        </div>
      </div>

      <!-- Tarjetas de resumen (cargando) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" id="clients-card">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
            <p class="text-white/70">Cargando...</p>
          </div>
        </div>
        <div class="rounded-2xl p-6 bg-gradient-to-br from-green-500 to-green-600 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" id="quotes-card">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
            <p class="text-white/70">Cargando...</p>
          </div>
        </div>
        <div class="rounded-2xl p-6 bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" id="invoices-card">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
            <p class="text-white/70">Cargando...</p>
          </div>
        </div>
      </div>
      
      <!-- Sección de bienvenida -->
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Bienvenido a AquaBuild, Wuarlin Dotel!</h3>
        <p class="text-gray-600">Sistema de gestión para empresas de construcción y reparación de piscinas.</p>
      </div>
    `;
    
    // Cargar estadísticas asíncronamente
    this.loadStats(container);
    
    return container;
  }
  
  async loadStats(container) {
    try {
      // Cargar estadísticas en paralelo
      const [clients, quotes, invoices] = await Promise.all([
        ClientService.getAll(),
        QuoteService.getAll(),
        InvoiceService.getAll()
      ]);
      
      // Obtener el nombre del usuario
      let displayName = 'Usuario';
      if (this.currentUser) {
        if (this.currentUser.displayName) {
          displayName = this.currentUser.displayName;
        } else if (this.currentUser.email) {
          displayName = this.currentUser.email.split('@')[0];
        }
      }
      
      // Actualizar las estadísticas
      const stats = {
        clients: clients.length,
        quotes: quotes.length,
        invoices: invoices.length,
        displayName: displayName
      };
      
      // Actualizar el DOM
      this.updateStatsDisplay(container, stats);
      
      // Agregar eventos de clic a las tarjetas
      this.addCardClickEvents(container);
      
    } catch (error) {
      console.error('Error al cargar el dashboard:', error);
      this.showError(container);
    }
  }
  
  updateStatsDisplay(container, stats) {
    const statsHTML = `
      <!-- Tarjeta personalizada de bienvenida -->
      <div class="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg">HOLA, ${stats.displayName.toUpperCase()}</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-3">Tu operación avanza con ${stats.clients} clientes activos</h2>
        <p class="text-gray-600 text-base mb-6 leading-relaxed">Continúa impulsando tu negocio con documentos profesionales, reportes claros y flujos de trabajo fluidos.</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <button id="create-quote-btn" class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Crear cotización
          </button>
          <button id="view-clients-btn" class="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Ver clientes
          </button>
        </div>
      </div>

      <!-- Tarjetas de resumen -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjeta de Clientes -->
        <div class="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" id="clients-card">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">Clientes Activos</h3>
            <p class="text-4xl font-bold text-white mb-2">${stats.clients}</p>
            <p class="text-white/70 text-sm">Total de clientes registrados</p>
          </div>
        </div>
        
        <!-- Tarjeta de Cotizaciones -->
        <div class="rounded-2xl p-6 bg-gradient-to-br from-green-500 to-green-600 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" id="quotes-card">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">Cotizaciones</h3>
            <p class="text-4xl font-bold text-white mb-2">${stats.quotes}</p>
            <p class="text-white/70 text-sm">Cotizaciones generadas</p>
          </div>
        </div>
        
        <!-- Tarjeta de Facturas -->
        <div class="rounded-2xl p-6 bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" id="invoices-card">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-white/80 text-sm font-semibold mb-2 uppercase tracking-wider">Facturas</h3>
            <p class="text-4xl font-bold text-white mb-2">${stats.invoices}</p>
            <p class="text-white/70 text-sm">Facturas emitidas</p>
          </div>
        </div>
      </div>
      
      <!-- Sección de bienvenida -->
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Bienvenido a AquaBuild, ${stats.displayName}!</h3>
        <p class="text-gray-600">Sistema de gestión para empresas de construcción y reparación de piscinas.</p>
      </div>
    `;
    
    // Reemplazar todo el contenido
    container.innerHTML = statsHTML;

    // Agregar eventos a los botones de acción
    setTimeout(() => {
      const createQuoteBtn = document.getElementById('create-quote-btn');
      const viewClientsBtn = document.getElementById('view-clients-btn');
      
      if (createQuoteBtn) {
        createQuoteBtn.addEventListener('click', () => {
          window.location.hash = 'quotes';
        });
      }
      
      if (viewClientsBtn) {
        viewClientsBtn.addEventListener('click', () => {
          window.location.hash = 'clients';
        });
      }
    }, 50);
  }
  
  addCardClickEvents(container) {
    const clientsCard = container.querySelector('#clients-card');
    const quotesCard = container.querySelector('#quotes-card');
    const invoicesCard = container.querySelector('#invoices-card');
    
    if (clientsCard) {
      clientsCard.addEventListener('click', () => {
        window.location.hash = 'clients';
      });
    }
    
    if (quotesCard) {
      quotesCard.addEventListener('click', () => {
        window.location.hash = 'quotes';
      });
    }
    
    if (invoicesCard) {
      invoicesCard.addEventListener('click', () => {
        window.location.hash = 'invoices';
      });
    }
  }
  
  showError(container) {
    const errorHTML = `
      <!-- Tarjeta de error -->
      <div class="bg-white rounded-2xl p-8 border-2 border-red-200 shadow-sm text-center">
        <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4v2m0 6v2m0-18v2a9 9 0 0118 0v2a9 9 0 01-18 0z"/>
        </svg>
        <p class="text-red-600 font-semibold mb-4">Error al cargar las estadísticas del dashboard</p>
        <button class="btn btn-primary" id="retry-dashboard">Reintentar</button>
      </div>
      
      <!-- Sección de bienvenida -->
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Bienvenido a AquaBuild</h3>
        <p class="text-gray-600">Sistema de gestión para empresas de construcción y reparación de piscinas.</p>
      </div>
    `;
    
    container.innerHTML = errorHTML;
    
    // Agregar evento al botón de reintento
    setTimeout(() => {
      const retryBtn = document.getElementById('retry-dashboard');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          this.loadStats(container);
        });
      }
    }, 100);
  }
}