// src/data/storage.js
export const Storage = {
  // Clientes
  getClients() {
    return JSON.parse(localStorage.getItem('clients') || '[]');
  },
  
  saveClients(clients) {
    localStorage.setItem('clients', JSON.stringify(clients));
  },
  
  // Cotizaciones
  getQuotes() {
    return JSON.parse(localStorage.getItem('quotes') || '[]');
  },
  
  saveQuotes(quotes) {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  },
  
  // Facturas
  getInvoices() {
    return JSON.parse(localStorage.getItem('invoices') || '[]');
  },
  
  saveInvoices(invoices) {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  },
  
  // Contadores
  getQuoteCounter() {
    return parseInt(localStorage.getItem('quoteCounter') || '1');
  },
  
  saveQuoteCounter(counter) {
    localStorage.setItem('quoteCounter', counter.toString());
  },
  
  getInvoiceCounter() {
    return parseInt(localStorage.getItem('invoiceCounter') || '1');
  },
  
  saveInvoiceCounter(counter) {
    localStorage.setItem('invoiceCounter', counter.toString());
  }
};