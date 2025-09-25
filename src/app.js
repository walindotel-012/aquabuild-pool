// src/app.js
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
  }
  
  checkAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = user;
        this.initApp();
      } else {
        this.showAuth();
      }
    });
  }
  
  showAuth() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-gray-100">Cargando...</div>';
    
    const authForm = new AuthForm(
      () => this.initApp(),
      (errorMessage) => {
        alert('Error de autenticación: ' + errorMessage);
        // Opcional: puedes mostrar el error en la UI en lugar de alert
      }
    );
    authForm.show();
  }
  
  initApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-gray-100">
        <header id="app-header"></header>
        <main class="container mx-auto px-4 py-8">
          <div id="page-content"></div>
        </main>
      </div>
    `;
    
    this.header = new Header((tab) => this.navigate(tab));
    document.getElementById('app-header').appendChild(this.header.render());
    this.navigate('dashboard');
  }
  
  navigate(page) {
    let newPage;
    
    switch (page) {
      case 'dashboard':
        newPage = new Dashboard();
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
      case 'logout':
        this.handleLogout();
        return;
      default:
        newPage = new Dashboard();
    }
    
    this.currentPage = newPage;
    document.getElementById('page-content').innerHTML = '';
    document.getElementById('page-content').appendChild(newPage.render());
  }
  
  async handleLogout() {
    const confirmed = confirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmed) {
      const success = await AuthForm.logout();
      if (success) {
        this.currentUser = null;
        this.showAuth();
      }
    }
  }
}