export class Header {
  constructor() {
    this.menuOpen = false;
  }

  render() {
    const header = document.createElement('header');
    header.className = 'bg-white border-b border-gray-100 sticky top-0 z-50';
    header.style.boxShadow = '0 1px 5px rgba(0,0,0,0.05)';
    header.style.height = '64px';
    header.style.padding = '16px 0';

    header.innerHTML = `
      <div class="container mx-auto px-4 flex justify-between items-center h-full">
        <!-- Logo y nombre -->
        <div class="flex items-center gap-3 cursor-pointer" id="logo-section">
          <div class="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
            <span class="text-sm font-bold text-white">AQ</span>
          </div>
          <h1 class="text-lg font-semibold text-gray-900">AquaBuild Suite</h1>
        </div>

        <!-- Navegación horizontal (visible en desktop) -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#dashboard" class="nav-link flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"/>
            </svg>
            <span>Principal</span>
          </a>
          <a href="#clients" class="nav-link flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span>Clientes</span>
          </a>
          <a href="#quotes" class="nav-link flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>Cotizaciones</span>
          </a>
          <a href="#invoices" class="nav-link flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Facturas</span>
          </a>
          <button id="logout-btn" class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </nav>

        <!-- Botón hamburguesa (siempre visible) -->
        <button id="menu-toggle" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Menú desplegable (móvil) -->
      <div id="dropdown-menu" class="hidden fixed top-16 right-4 w-80 max-w-[90%] bg-white shadow-lg rounded-lg p-0 z-50" style="flex-direction: column;">
        <!-- Encabezado del menú -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menú Principal</h3>
        </div>

        <!-- Enlaces de navegación -->
        <div class="flex flex-col py-2">
          <a href="#dashboard" class="nav-link flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"/>
            </svg>
            <span class="font-medium">Principal</span>
          </a>
          <a href="#clients" class="nav-link flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="font-medium">Clientes</span>
          </a>
          <a href="#quotes" class="nav-link flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="font-medium">Cotizaciones</span>
          </a>
          <a href="#invoices" class="nav-link flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">Facturas</span>
          </a>
        </div>

        <!-- Separador -->
        <div class="border-t border-gray-200"></div>

        <!-- Botón de cerrar sesión -->
        <button id="mobile-logout-btn" class="w-full px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-3 font-medium text-left">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    `;

    // Logo click - navegar a dashboard
    const logoSection = header.querySelector('#logo-section');
    if (logoSection) {
      logoSection.addEventListener('click', () => {
        window.location.hash = 'dashboard';
      });
    }

    // Navegación links
    header.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          const tab = href.replace('#', '');
          window.location.hash = tab;
          if (this.menuOpen) this.toggleMenu(false);
        }
      });
    });

    // Logout buttons
    const logoutBtn = header.querySelector('#logout-btn');
    const mobileLogoutBtn = header.querySelector('#mobile-logout-btn');
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => window.location.hash = 'logout');
    }
    
    if (mobileLogoutBtn) {
      mobileLogoutBtn.addEventListener('click', () => window.location.hash = 'logout');
    }

    // Toggle menu
    const toggleBtn = header.querySelector('#menu-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleMenu());
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('dropdown-menu');
      const toggle = document.getElementById('menu-toggle');
      if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target) && this.menuOpen) {
        this.toggleMenu(false);
      }
    });

    return header;
  }

  toggleMenu(forceState = null) {
    const menu = document.getElementById('dropdown-menu');
    if (!menu) return;
    
    const newState = forceState !== null ? forceState : !this.menuOpen;
    this.menuOpen = newState;

    if (this.menuOpen) {
      menu.classList.remove('hidden');
      menu.style.display = 'flex';
    } else {
      menu.classList.add('hidden');
      menu.style.display = 'none';
    }
  }

  setActiveTab(tab) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('font-bold', 'text-blue-600');
      const href = link.getAttribute('href');
      if (href && href.replace('#', '') === tab) {
        link.classList.add('font-bold', 'text-blue-600');
      }
    });
  }
}
