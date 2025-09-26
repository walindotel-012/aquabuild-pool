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
  
  // Manejo de errores globales
  window.addEventListener('error', (event) => {
    toast.error('Ha ocurrido un error inesperado. Por favor, recargue la página.');
    console.error('Error global:', event.error);
  });
  
  this.checkAuth();
}
  
  checkAuth() {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = user;
          this.initApp();
        } else {
          this.showAuth();
        }
      }, (error) => {
        console.error('Error en autenticación:', error);
        this.showError('Error en el sistema de autenticación. Por favor, recarga la página.');
      });
    } catch (error) {
      console.error('Error al inicializar autenticación:', error);
      this.showError('No se pudo inicializar el sistema de autenticación.');
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
  
  showAuth() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = '<div class="min-h-screen flex items-center justify-center bg-gray-100">Cargando...</div>';
    
    try {
      const authForm = new AuthForm(
        () => this.initApp(),
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
      this.header = new Header((tab) => this.navigate(tab));
      const headerElement = this.header.render();
      if (headerElement) {
        document.getElementById('app-header').appendChild(headerElement);
        this.navigate('dashboard');
      } else {
        throw new Error('No se pudo crear el header');
      }
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      this.showError('Error al inicializar la aplicación principal.');
    }
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
  
  // Cerrar menú si existe
  const menu = document.getElementById('dropdown-menu');
  if (menu) {
    menu.classList.add('hidden');
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