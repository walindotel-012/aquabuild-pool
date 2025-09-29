export class Header {
  constructor() {
    this.menuOpen = false;
  }

  render() {
    const header = document.createElement('header');
    header.className = 'bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg sticky top-0 z-50';

    header.innerHTML = `
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">🌊</span>
          <h1 class="text-xl font-bold">AquaBuild</h1>
        </div>

        <!-- Botón hamburguesa -->
        <button id="menu-toggle" class="p-2 focus:outline-none hover:scale-110 transition-transform">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

      <!-- Overlay -->
      <div id="menu-overlay" class="hidden"></div>

      <!-- Menú desplegable -->
      <div id="dropdown-menu" class="hidden fixed top-16 right-4 w-80 max-w-[90%] bg-white shadow-lg rounded-lg flex flex-col gap-4 p-6 z-50 transition-transform duration-300">
        <a href="#dashboard" class="tab-link flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6"/>
          </svg>
          Principal
        </a>
        <a href="#clients" class="tab-link flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          Clientes
        </a>
        <a href="#quotes" class="tab-link flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Cotizaciones
        </a>
        <a href="#invoices" class="tab-link flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Facturas
        </a>
        <button id="mobile-logout-btn" class="btn btn-outline mt-2 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7"/>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    `;
      // --------- AQUÍ AGREGAMOS EL EVENTO PARA "AquaBuild" ---------
  const title = header.querySelector('h1');
  if (title) {
    title.style.cursor = 'pointer'; // cursor indica que es clickeable
    title.addEventListener('click', () => {
      window.location.hash = 'dashboard'; // navega al dashboard
    });
  }

    // Tabs click + navegación hash
    header.querySelectorAll('.tab-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const tab = link.getAttribute('href').replace('#', '');
        this.setActiveTab(tab);
        window.location.hash = tab;  // Navegación por hash
        if (this.menuOpen) this.toggleMenu(false);
      });
    });

    // Logout click
    header.querySelector('#mobile-logout-btn')?.addEventListener('click', () => window.location.hash = 'logout');

    // Toggle menu
    const toggleBtn = header.querySelector('#menu-toggle');
    toggleBtn.addEventListener('click', () => this.toggleMenu());

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('dropdown-menu');
      const toggle = document.getElementById('menu-toggle');
      if (!menu.contains(e.target) && !toggle.contains(e.target) && this.menuOpen) {
        this.toggleMenu(false);
      }
    });

    return header;
  }

  toggleMenu(forceState = null) {
    const menu = document.getElementById('dropdown-menu');
    const overlay = document.getElementById('menu-overlay');
    const newState = forceState !== null ? forceState : !this.menuOpen;
    this.menuOpen = newState;

    if (this.menuOpen) {
      menu.classList.remove('hidden');
      overlay.classList.add('active');
    } else {
      menu.classList.add('hidden');
      overlay.classList.remove('active');
    }

    overlay.addEventListener('click', () => this.toggleMenu(false));
  }

  setActiveTab(tab) {
    document.querySelectorAll('.tab-link').forEach(link => {
      link.classList.remove('font-bold', 'text-blue-600');
      if (link.getAttribute('href').replace('#', '') === tab) {
        link.classList.add('font-bold', 'text-blue-600');
      }
    });
  }
}
