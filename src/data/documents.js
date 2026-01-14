// src/data/documents.js
import { Storage } from './storage.js';

export const DocumentService = {
  // Cotizaciones
  getQuotes() {
    return Storage.getQuotes();
  },
  
  createQuote(quoteData) {
    const quotes = this.getQuotes();
    const counter = Storage.getQuoteCounter();
    const newQuote = {
      id: Date.now().toString(),
      number: `COT-${counter.toString().padStart(4, '0')}`,
      status: 'Pendiente',
      ...quoteData
    };
    quotes.push(newQuote);
    Storage.saveQuotes(quotes);
    Storage.saveQuoteCounter(counter + 1);
    return newQuote;
  },
  
  deleteQuote(id) {
    const quotes = this.getQuotes();
    const filtered = quotes.filter(quote => quote.id !== id);
    Storage.saveQuotes(filtered);
    return filtered.length !== quotes.length;
  },
  
  // Facturas
  getInvoices() {
    return Storage.getInvoices();
  },
  
  createInvoice(invoiceData) {
    const invoices = this.getInvoices();
    const counter = Storage.getInvoiceCounter();
    const newInvoice = {
      id: Date.now().toString(),
      number: `FAC-${counter.toString().padStart(4, '0')}`,
      ...invoiceData
    };
    invoices.push(newInvoice);
    Storage.saveInvoices(invoices);
    Storage.saveInvoiceCounter(counter + 1);
    return newInvoice;
  },
  
  deleteInvoice(id) {
    const invoices = this.getInvoices();
    const filtered = invoices.filter(invoice => invoice.id !== id);
    Storage.saveInvoices(filtered);
    return filtered.length !== invoices.length;
  }
};