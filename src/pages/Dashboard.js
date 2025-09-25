// src/pages/Dashboard.js
import { ClientService } from '../data/clients.js';
import { DocumentService } from '../data/documents.js';

export class Dashboard {
  render() {
    const clients = ClientService.getAll();
    const quotes = DocumentService.getQuotes();
    const invoices = DocumentService.getInvoices();
    
    const container = document.createElement('div');
    container.className = 'space-y-6';
    
    const dashboardHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-blue-800 mb-2">Clientes</h3>
            <p class="text-3xl font-bold text-blue-600">${clients.length}</p>
            <p class="text-sm text-blue-600 mt-1">Total de clientes registrados</p>
          </div>
        </div>
        
        <div class="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-green-800 mb-2">Cotizaciones</h3>
            <p class="text-3xl font-bold text-green-600">${quotes.length}</p>
            <p class="text-sm text-green-600 mt-1">Cotizaciones generadas</p>
          </div>
        </div>
        
        <div class="card bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-500">
          <div class="text-center">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">Facturas</h3>
            <p class="text-3xl font-bold text-yellow-600">${invoices.length}</p>
            <p class="text-sm text-yellow-600 mt-1">Facturas emitidas</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Bienvenido a AquaBuild</h2>
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
              <li>• Almacenamiento local seguro</li>
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
    
    container.innerHTML = dashboardHTML;
    return container;
  }
}