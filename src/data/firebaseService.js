// src/data/firebaseService.js
import { db } from '../firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';

// Clientes
export const ClientService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, 'clients'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  async getById(id) {
    const docRef = doc(db, 'clients', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },
  
  async create(clientData) {
    const docRef = await addDoc(collection(db, 'clients'), clientData);
    return { id: docRef.id, ...clientData };
  },
  
  async update(id, clientData) {
    const docRef = doc(db, 'clients', id);
    await updateDoc(docRef, clientData);
    return { id, ...clientData };
  },
  
  async delete(id) {
    await deleteDoc(doc(db, 'clients', id));
  }
};

// Cotizaciones
export const QuoteService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, 'quotes'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  async create(quoteData) {
    // Obtener el siguiente número de cotización
    const quotes = await this.getAll();
    const counter = quotes.length + 1;
    const quoteWithNumber = {
      ...quoteData,
      number: `COT-${counter.toString().padStart(4, '0')}`,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'quotes'), quoteWithNumber);
    return { id: docRef.id, ...quoteWithNumber };
  },
  
  async delete(id) {
    await deleteDoc(doc(db, 'quotes', id));
  }
};

// Facturas
export const InvoiceService = {
  async getAll() {
    const querySnapshot = await getDocs(collection(db, 'invoices'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  async create(invoiceData) {
    // Obtener el siguiente número de factura
    const invoices = await this.getAll();
    const counter = invoices.length + 1;
    const invoiceWithNumber = {
      ...invoiceData,
      number: `FAC-${counter.toString().padStart(4, '0')}`,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'invoices'), invoiceWithNumber);
    return { id: docRef.id, ...invoiceWithNumber };
  },
  
  async delete(id) {
    await deleteDoc(doc(db, 'invoices', id));
  }
};