// src/components/layout/Header.js
export class Header {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.currentTab = 'dashboard';
  }
  
  render() {
    const header = document.createElement('header');
    header.className = 'bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg';
    header.innerHTML = `
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🌊</span>
            <h1 class="text-xl font-bold">AquaBuild</h1>
          </div>
          <div class="flex items-center space-x-6">
            <nav>
              <ul class="flex space-x-6">
                <li><a href="#" data-tab="dashboard" class="tab-link hover:text-cyan-200 transition-colors">Dashboard</a></li>
                <li><a href="#" data-tab="clients" class="tab-link hover:text-cyan-200 transition-colors">Clientes</a></li>
                <li><a href="#" data-tab="quotes" class="tab-link hover:text-cyan-200 transition-colors">Cotizaciones</a></li>
                <li><a href="#" data-tab="invoices" class="tab-link hover:text-cyan-200 transition-colors">Facturas</a></li>
              </ul>
            </nav>
            <button id="logout-btn" class="btn btn-outline text-white border-white hover:bg-white hover:text-blue-700">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add event listeners
    header.querySelectorAll('.tab-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        this.setActiveTab(tab);
        this.onNavigate(tab);
      });
    });
    
    header.querySelector('#logout-btn').addEventListener('click', (e) => {
      e.preventDefault();
      this.onNavigate('logout');
    });
    
    return header;
  }
  
  setActiveTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-link').forEach(link => {
      link.classList.remove('font-bold', 'text-cyan-200');
      if (link.getAttribute('data-tab') === tab) {
        link.classList.add('font-bold', 'text-cyan-200');
      }
    });
  }
}