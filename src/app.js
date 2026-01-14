import { Header } from './components/layout/Header.js';
import { Dashboard } from './pages/Dashboard.js';
import { ClientsPage } from './pages/ClientsPage.js';
import { QuotesPage } from './pages/QuotesPage.js';
import { InvoicesPage } from './pages/InvoicesPage.js';
import { MaintenancePage } from './pages/MaintenancePage.js';
import { AuthForm } from './components/auth/AuthForm.js';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export class App {
  constructor() {
    this.currentPage = null;
    this.currentUser = null;
    this.checkAuth();
    this.setupHashNavigation();
  }
  
  checkAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.initApp();
        this.handleHashChange();
      } else {
        this.showAuth();
      }
    });
  }
  
  setupHashNavigation() {
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
  }
  
  handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    this.navigate(hash);
  }
  
  showAuth() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-gray-100">Cargando...</div>';
    
    try {
      const authForm = new AuthForm(
        () => {
          this.initApp();
          this.handleHashChange();
        },
        (errorMessage) => {
          console.error('Error de autenticación:', errorMessage);
          alert('Error de autenticación: ' + errorMessage);
        }
      );
      authForm.show();
    } catch (error) {
      console.error('Error al mostrar formulario de autenticación:', error);
      this.showError('No se pudo cargar el formulario de autenticación.');
    }
  }
  
  showError(message) {
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-red-50">
          <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h2 class="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p class="text-gray-700 mb-4">${message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Recargar</button>
          </div>
        </div>
      `;
    }
  }
  
  initApp() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
      <div class="min-h-screen bg-gray-100">
        <header id="app-header"></header>
        <main class="container mx-auto px-4 py-8">
          <div id="page-content"></div>
        </main>
      </div>
    `;
    
    try {
      this.header = new Header();
      const headerElement = this.header.render();
      if (headerElement) {
        document.getElementById('app-header').appendChild(headerElement);
        this.handleHashChange();
      }
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      this.showError('Error al inicializar la aplicación principal.');
    }
  }
  
  navigate(page) {
    // Actualizar el hash en la URL
    if (window.location.hash.replace('#', '') !== page) {
      window.location.hash = page;
    }
    
    let newPage;
    
    switch (page) {
      case 'dashboard':
        newPage = new Dashboard(this.currentUser);
        break;
      case 'clients':
        newPage = new ClientsPage();
        break;
      case 'quotes':
        newPage = new QuotesPage();
        break;
      case 'invoices':
        newPage = new InvoicesPage();
        break;
      case 'maintenance':
        newPage = new MaintenancePage(document.getElementById('page-content'));
        newPage.render();
        return;
      case 'logout':
        this.handleLogout();
        return;
      default:
        newPage = new Dashboard(this.currentUser);
        window.location.hash = 'dashboard';
    }
    
    this.currentPage = newPage;
    document.getElementById('page-content').innerHTML = '';
    document.getElementById('page-content').appendChild(newPage.render());
    
    // Actualizar el header activo
    if (this.header) {
      this.header.setActiveTab(page);
    }
  }
  
  async handleLogout() {
    const confirmed = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmed) {
      try {
        const success = await AuthForm.logout();
        if (success) {
          this.currentUser = null;
          this.showAuth();
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión: ' + error.message);
      }
    }
  }
}