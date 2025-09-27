// src/pages/Dashboard.js
import { ClientService } from '../data/firebaseService.js';
import { QuoteService } from '../data/firebaseService.js';
import { InvoiceService } from '../data/firebaseService.js';

export class Dashboard {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.stats = {
      clients: 0,
      quotes: 0,
      invoices: 0
    };
  }
  
  render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
    // Mostrar spinner de carga inicial
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow" id="clients-card">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando...</p>
          </div>
        </div>
        <div class="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow" id="quotes-card">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando...</p>
          </div>
        </div>
        <div class="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 cursor-pointer hover:shadow-lg transition-shadow" id="invoices-card">
          <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bienvenido a AquaBuild</h2>
        <p class="text-gray-600 mb-4">
          Sistema de gestión para empresas de construcción y reparación de piscinas.
        </p>
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
      
      // Actualizar las estadísticas
      this.stats = {
        clients: clients.length,
        quotes: quotes.length,
        invoices: invoices.length
      };
      
      // Actualizar el DOM
      this.updateStatsDisplay(container);
      
      // Agregar eventos de clic a las tarjetas
      this.addCardClickEvents(container);
      
    } catch (error) {
      console.error('Error al cargar el dashboard:', error);
      this.showError(container);
    }
  }
  
  updateStatsDisplay(container) {
    const statsHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tarjeta de Clientes -->
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-shadow" id="clients-card">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-blue-800 mb-2">Clientes</h3>
            <p class="text-3xl font-bold text-blue-600">${this.stats.clients}</p>
            <p class="text-sm text-blue-600 mt-1">Total de clientes registrados</p>
          </div>
        </div>
        
        <!-- Tarjeta de Cotizaciones -->
        <div class="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow" id="quotes-card">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-green-800 mb-2">Cotizaciones</h3>
            <p class="text-3xl font-bold text-green-600">${this.stats.quotes}</p>
            <p class="text-sm text-green-600 mt-1">Cotizaciones generadas</p>
          </div>
        </div>
        
        <!-- Tarjeta de Facturas -->
        <div class="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 cursor-pointer hover:shadow-lg transition-shadow" id="invoices-card">
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mb-3">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">Facturas</h3>
            <p class="text-3xl font-bold text-yellow-600">${this.stats.invoices}</p>
            <p class="text-sm text-yellow-600 mt-1">Facturas emitidas</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Bienvenido a AquaBuild</h2>
        <p class="text-gray-600 mb-4">
          Sistema de gestión para empresas de construcción y reparación de piscinas.
          Aquí puede gestionar sus clientes, crear cotizaciones y facturas, y llevar un control
          completo de su negocio.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="font-semibold text-blue-800 mb-2">Características</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Gestión completa de clientes (CRUD)</li>
              <li>• Creación de cotizaciones con numeración automática</li>
              <li>• Generación de facturas con secuencia</li>
              <li>• Impresión en PDF</li>
              <li>• Almacenamiento en la nube</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <h3 class="font-semibold text-green-800 mb-2">Consejos de uso</h3>
            <ul class="text-sm text-green-700 space-y-1">
              <li>• Comience creando sus clientes</li>
              <li>• Use cotizaciones para presupuestos</li>
              <li>• Convierta cotizaciones en facturas</li>
              <li>• Imprima documentos para sus clientes</li>
              <li>• Revise el dashboard para estadísticas</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Reemplazar solo la parte de estadísticas
    const statsContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    if (statsContainer) {
      const newStatsContainer = document.createElement('div');
      newStatsContainer.innerHTML = statsHTML;
      const firstGrid = newStatsContainer.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
      if (firstGrid) {
        statsContainer.parentNode.replaceChild(firstGrid, statsContainer);
      }
    }
  }
  
  addCardClickEvents(container) {
    const clientsCard = container.querySelector('#clients-card');
    const quotesCard = container.querySelector('#quotes-card');
    const invoicesCard = container.querySelector('#invoices-card');
    
    if (clientsCard) {
      clientsCard.addEventListener('click', () => {
        this.onNavigate('clients');
      });
    }
    
    if (quotesCard) {
      quotesCard.addEventListener('click', () => {
        this.onNavigate('quotes');
      });
    }
    
    if (invoicesCard) {
      invoicesCard.addEventListener('click', () => {
        this.onNavigate('invoices');
      });
    }
  }
  
  showError(container) {
    const errorHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card text-center py-8 col-span-full">
          <p class="text-red-500">Error al cargar las estadísticas del dashboard</p>
          <button class="btn btn-primary mt-4" id="retry-dashboard">Reintentar</button>
        </div>
      </div>
    `;
    
    const statsContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
    if (statsContainer) {
      statsContainer.outerHTML = errorHTML;
      
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
}