import './styles/main.css';
import { Header } from './components/layout/Header.js';
import { Dashboard } from './pages/Dashboard.js';
import { ClientsPage } from './pages/ClientsPage.js';
import { QuotesPage } from './pages/QuotesPage.js';
import { InvoicesPage } from './pages/InvoicesPage.js';
import { AuthForm } from './components/auth/AuthForm.js';
import { auth } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export class App {
  constructor() {
    this.currentPage = null;
    this.currentUser = null;
    this.checkAuth();
    window.addEventListener('hashchange', () => this.handleHashChange());
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
    } catch {
      app.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-red-100">Error al cargar autenticación</div>';
    }
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
    if (window.location.hash.replace('#', '') !== page) window.location.hash = page;

    let newPage;
    switch (page) {
      case 'dashboard': newPage = new Dashboard(this.currentUser); break;
      case 'clients': newPage = new ClientsPage(); break;
      case 'quotes': newPage = new QuotesPage(); break;
      case 'invoices': newPage = new InvoicesPage(); break;
      case 'logout': this.handleLogout(); return;
      default: newPage = new Dashboard(this.currentUser); window.location.hash = 'dashboard';
    }

    this.currentPage = newPage;
    const content = document.getElementById('page-content');
    content.innerHTML = '';
    content.appendChild(newPage.render());

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
