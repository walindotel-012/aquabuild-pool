// src/components/layout/Header.js
export class Header {
  constructor(onNavigate) {
    this.onNavigate = onNavigate;
    this.currentTab = 'dashboard';
    this.isMenuOpen = false;
  }
  
  render() {
    const header = document.createElement('header');
    header.className = 'bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg';
    header.innerHTML = `
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <!-- Logo y nombre -->
          <div class="flex items-center space-x-3">
            <span class="text-2xl">🌊</span>
            <h1 class="text-xl font-bold">AquaBuild</h1>
          </div>
          
          <!-- Menú hamburguesa para todos los dispositivos -->
          <button id="menu-toggle" class="text-white focus:outline-none ml-4">
            <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        <!-- Menú desplegable overlay para todos los dispositivos -->
        <div id="menu-overlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden" style="display: none;"></div>
        
        <div id="dropdown-menu" class="hidden absolute top-full left-4 right-4 md:left-auto md:right-auto md:w-96 bg-white text-gray-800 rounded-lg shadow-xl z-50 mt-2 overflow-hidden">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-700 mb-3">MENÚ PRINCIPAL</h3>
            <nav>
              <ul class="space-y-2">
                <li>
                  <a href="#" data-tab="dashboard" class="block py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="font-medium">Principal</span>
                  </a>
                </li>
                <li>
                  <a href="#" data-tab="quotes" class="block py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="font-medium">Cotizaciones</span>
                  </a>
                </li>
                <li>
                  <a href="#" data-tab="invoices" class="block py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="font-medium">Facturas</span>
                  </a>
                </li>
                <li>
                  <a href="#" data-tab="clients" class="block py-3 px-4 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center space-x-3">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span class="font-medium">Clientes</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="p-4 bg-gray-50">
            <button id="menu-logout-btn" class="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Configurar eventos después de que el DOM esté listo
    setTimeout(() => {
      const menuToggle = document.getElementById('menu-toggle');
      const dropdownMenu = document.getElementById('dropdown-menu');
      const menuOverlay = document.getElementById('menu-overlay');
      const menuIcon = document.getElementById('menu-icon');
      
      if (!menuToggle || !dropdownMenu || !menuOverlay || !menuIcon) {
        console.error('Elementos del menú no encontrados');
        return;
      }
      
      // Evento para abrir/cerrar menú
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu(dropdownMenu, menuOverlay, menuIcon);
      });
      
      // Eventos para navegación
      const navLinks = dropdownMenu.querySelectorAll('[data-tab]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const tab = link.getAttribute('data-tab');
          this.setActiveTab(tab);
          this.onNavigate(tab);
          this.closeMenu(dropdownMenu, menuOverlay, menuIcon);
        });
      });
      
      // Evento para logout
      const logoutBtn = document.getElementById('menu-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.onNavigate('logout');
          this.closeMenu(dropdownMenu, menuOverlay, menuIcon);
        });
      }
      
      // Cerrar menú al hacer clic fuera
      document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && this.isMenuOpen) {
          this.closeMenu(dropdownMenu, menuOverlay, menuIcon);
        }
      });
      
      // Cerrar menú con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isMenuOpen) {
          this.closeMenu(dropdownMenu, menuOverlay, menuIcon);
        }
      });
      
    }, 100);
    
    return header;
  }
  
  toggleMenu(dropdownMenu, menuOverlay, menuIcon) {
    if (this.isMenuOpen) {
      this.closeMenu(dropdownMenu, menuOverlay, menuIcon);
    } else {
      this.openMenu(dropdownMenu, menuOverlay, menuIcon);
    }
  }
  
  openMenu(dropdownMenu, menuOverlay, menuIcon) {
    dropdownMenu.classList.remove('hidden');
    menuOverlay.classList.remove('hidden');
    menuIcon.style.transform = 'rotate(180deg)';
    this.isMenuOpen = true;
    
    // Posicionar el menú debajo del header
    const header = dropdownMenu.closest('header');
    if (header) {
      const headerRect = header.getBoundingClientRect();
      dropdownMenu.style.top = `${headerRect.height + 10}px`;
    }
  }
  
  closeMenu(dropdownMenu, menuOverlay, menuIcon) {
    dropdownMenu.classList.add('hidden');
    menuOverlay.classList.add('hidden');
    menuIcon.style.transform = 'rotate(0deg)';
    this.isMenuOpen = false;
  }
  
  setActiveTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('[data-tab]').forEach(link => {
      link.classList.remove('font-bold', 'text-blue-700');
      if (link.getAttribute('data-tab') === tab) {
        link.classList.add('font-bold', 'text-blue-700');
      }
    });
  }
}