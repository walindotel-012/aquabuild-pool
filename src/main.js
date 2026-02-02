import './styles/main.css';
import { Header } from './components/layout/Header.js';
import { Dashboard } from './pages/Dashboard.js';
import { ClientsPage } from './pages/ClientsPage.js';
import { QuotesPage } from './pages/QuotesPage.js';
import { InvoicesPage } from './pages/InvoicesPage.js';
import { MaintenancePage } from './pages/MaintenancePage.js';
import { AuthForm } from './components/auth/AuthForm.js';
import { auth, firebaseInitialized } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export class App {
  constructor() {
    this.currentPage = null;
    this.currentUser = null;
    // Setup listener ANTES de checkAuth para que esté listo
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.checkAuth();
  }

  checkAuth() {
    if (!firebaseInitialized) {
      console.error('Firebase no inicializado');
      this.showError('Error al conectar con Firebase');
      return;
    }

    let authResolved = false;
    const timeout = setTimeout(() => {
      if (!authResolved) {
        console.warn('Timeout autenticación - mostrando login');
        authResolved = true;
        this.showAuth();
      }
    }, 15000);

    onAuthStateChanged(auth, (user) => {
      if (authResolved) return;
      authResolved = true;
      clearTimeout(timeout);
      
      if (user) {
        console.log('Usuario autenticado:', user.email);
        this.currentUser = user;
        this.initApp();
        this.handleHashChange();
      } else {
        console.log('Sin usuario - mostrando login');
        this.showAuth();
      }
    }, (error) => {
      if (authResolved) return;
      authResolved = true;
      clearTimeout(timeout);
      console.error('Error auth:', error);
      this.showAuth();
    });
  }

  showAuth() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-gray-100">Cargando...</div>';
    try {
      const authForm = new AuthForm(
        () => { this.initApp(); this.handleHashChange(); },
        (errorMessage) => { alert('Error: ' + errorMessage); }
      );
      authForm.show();
    } catch (error) {
      console.error('Error AuthForm:', error);
      app.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-red-100 p-4">Error al cargar</div>';
    }
  }

  showError(message) {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `<div class="min-h-screen flex items-center justify-center bg-red-100 p-4"><div class="text-center"><h1 class="text-2xl font-bold text-red-700 mb-4">Error</h1><p class="text-red-600">${message}</p></div></div>`;
  }

  initApp() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <header id="app-header"></header>
        <main class="container mx-auto px-4 py-8">
          <div id="page-content"></div>
        </main>
      </div>
    `;

    this.header = new Header();
    document.getElementById('app-header').appendChild(this.header.render());
    this.handleHashChange();
  }

  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigate(hash);
  }

  navigate(page) {
    // Si el hash no coincide con la página, actualizar y esperar al hashchange
    if (window.location.hash.replace('#', '') !== page) {
      window.location.hash = page;
      return; // El hashchange listener disparará navigate() nuevamente
    }

    let newPage;
    let shouldRender = false;

    // Verificar si es la misma página para evitar recrearla
    switch (page) {
      case 'dashboard':
        if (!(this.currentPage instanceof Dashboard)) {
          newPage = new Dashboard(this.currentUser);
          shouldRender = true;
        }
        break;
      case 'clients':
        if (!(this.currentPage instanceof ClientsPage)) {
          newPage = new ClientsPage();
          shouldRender = true;
        }
        break;
      case 'quotes':
        if (!(this.currentPage instanceof QuotesPage)) {
          newPage = new QuotesPage();
          shouldRender = true;
        }
        break;
      case 'invoices':
        if (!(this.currentPage instanceof InvoicesPage)) {
          newPage = new InvoicesPage();
          shouldRender = true;
        }
        break;
      case 'maintenance':
        if (!(this.currentPage instanceof MaintenancePage)) {
          newPage = new MaintenancePage();
          shouldRender = true;
        }
        break;
      case 'logout':
        this.handleLogout();
        return;
      default:
        if (!(this.currentPage instanceof Dashboard)) {
          newPage = new Dashboard(this.currentUser);
          shouldRender = true;
          window.location.hash = 'dashboard';
        }
    }

    // Solo renderizar si se creó una nueva página
    if (shouldRender && newPage) {
      this.currentPage = newPage;
      const content = document.getElementById('page-content');
      if (content) {
        content.innerHTML = '';
        const rendered = newPage.render();
        if (rendered instanceof Promise) {
          rendered.then(element => {
            content.appendChild(element);
          }).catch(error => {
            console.error('Error al renderizar página:', error);
          });
        } else {
          content.appendChild(rendered);
        }
      }
    }

    if (this.header) this.header.setActiveTab(page);
  }

  async handleLogout() {
    if (!confirm('¿Cerrar sesión?')) return;
    try {
      const success = await AuthForm.logout();
      if (success) {
        this.currentUser = null;
        this.showAuth();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new App());
