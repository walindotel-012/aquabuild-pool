// src/app.js
import { Header } from './components/layout/Header.js';
import { Dashboard } from './pages/Dashboard.js';
import { ClientsPage } from './pages/ClientsPage.js';
import { QuotesPage } from './pages/QuotesPage.js';
import { InvoicesPage } from './pages/InvoicesPage.js';

export class App {
  constructor() {
    this.currentPage = null;
    this.header = new Header((tab) => this.navigate(tab));
    this.init();
  }
  
  init() {
    // Create main container
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="min-h-screen bg-gray-100">
        <header id="app-header"></header>
        <main class="container mx-auto px-4 py-8">
          <div id="page-content"></div>
        </main>
      </div>
    `;
    
    // Render header
    document.getElementById('app-header').appendChild(this.header.render());
    
    // Load initial page
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
      default:
        newPage = new Dashboard();
    }
    
    this.currentPage = newPage;
    document.getElementById('page-content').innerHTML = '';
    document.getElementById('page-content').appendChild(newPage.render());
    
    // Update header active tab
    this.header.setActiveTab(page);
  }
}