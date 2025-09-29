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
    try {
      const querySnapshot = await getDocs(collection(db, 'clients'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw new Error('No se pudieron cargar los clientes');
    }
  },

  async getById(id) {
    try {
      const docRef = doc(db, 'clients', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw new Error('No se pudo cargar el cliente');
    }
  },

  async create(clientData) {
    try {
      if (!clientData.name) {
        throw new Error('Nombre es requerido');
      }
      const docRef = await addDoc(collection(db, 'clients'), {
        ...clientData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...clientData };
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw new Error('Error al crear el cliente: ' + error.message);
    }
  },

  async update(id, clientData) {
    try {
      if (!clientData.name) {
        throw new Error('Nombre es requerido');
      }
      const docRef = doc(db, 'clients', id);
      await updateDoc(docRef, clientData);
      return { id, ...clientData };
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw new Error('Error al actualizar el cliente: ' + error.message);
    }
  },

  async delete(id) {
    try {
      await deleteDoc(doc(db, 'clients', id));
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw new Error('Error al eliminar el cliente: ' + error.message);
    }
  }
};

// Cotizaciones
export const QuoteService = {
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'quotes'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      throw new Error('No se pudieron cargar las cotizaciones');
    }
  },

 async create(quoteData) {
  try {
    if (!quoteData.clientName) {
      throw new Error('Nombre del cliente es requerido');
    }
    
    const subtotal = quoteData.items.reduce((sum, item) => sum + item.total, 0);
    
    // Obtener el siguiente número con formato COT-20100
    const quotes = await this.getAll();
    const lastQuote = quotes
      .filter(q => q.number && q.number.startsWith('COT-'))
      .sort((a, b) => {
        const numA = parseInt(a.number.replace('COT-', '')) || 0;
        const numB = parseInt(b.number.replace('COT-', '')) || 0;
        return numB - numA;
      })[0];
    
    let nextNumber;
    if (lastQuote) {
      const lastNum = parseInt(lastQuote.number.replace('COT-', '')) || 20099;
      nextNumber = lastNum + 1;
    } else {
      nextNumber = 20100; // Comenzar desde COT-20100
    }
    
    const quoteWithNumber = {
      clientId: quoteData.clientId || '',
      clientName: quoteData.clientName,
      clientPhone: quoteData.clientPhone || '',
      clientAddress: quoteData.clientAddress || '',
      date: quoteData.date,
      items: quoteData.items,
      subtotal: subtotal,
      total: subtotal,
      number: `COT-${nextNumber}`,
      status: 'Pendiente',
      converted: false,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'quotes'), quoteWithNumber);
    return { id: docRef.id, ...quoteWithNumber };
  } catch (error) {
    console.error('Error al crear cotización:', error);
    throw new Error('Error al crear la cotización: ' + error.message);
  }
},

  async update(id, quoteData) {
    try {
      const docRef = doc(db, 'quotes', id);
      await updateDoc(docRef, quoteData);
      return { id, ...quoteData };
    } catch (error) {
      console.error('Error al actualizar cotización:', error);
      throw new Error('Error al actualizar la cotización: ' + error.message);
    }
  },

  async delete(id) {
    try {
      await deleteDoc(doc(db, 'quotes', id));
    } catch (error) {
      console.error('Error al eliminar cotización:', error);
      throw new Error('Error al eliminar la cotización: ' + error.message);
    }
  }
};

// Facturas
export const InvoiceService = {
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'invoices'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      throw new Error('No se pudieron cargar las facturas');
    }
  },

 async create(invoiceData) {
  try {
    if (!invoiceData.clientName) {
      throw new Error('Nombre del cliente es requerido');
    }
    
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
    
    // Obtener el siguiente número con formato FAC-20100
    const invoices = await this.getAll();
    const lastInvoice = invoices
      .filter(i => i.number && i.number.startsWith('FAC-'))
      .sort((a, b) => {
        const numA = parseInt(a.number.replace('FAC-', '')) || 0;
        const numB = parseInt(b.number.replace('FAC-', '')) || 0;
        return numB - numA;
      })[0];
    
    let nextNumber;
    if (lastInvoice) {
      const lastNum = parseInt(lastInvoice.number.replace('FAC-', '')) || 20099;
      nextNumber = lastNum + 1;
    } else {
      nextNumber = 20100; // Comenzar desde FAC-20100
    }
    
    const invoiceWithNumber = {
      clientId: invoiceData.clientId || '',
      clientName: invoiceData.clientName,
      clientPhone: invoiceData.clientPhone || '',
      clientAddress: invoiceData.clientAddress || '',
      date: invoiceData.date,
      items: invoiceData.items,
      subtotal: subtotal,
      total: subtotal,
      number: `FAC-${nextNumber}`,
      relatedQuoteId: invoiceData.relatedQuoteId || null,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'invoices'), invoiceWithNumber);
    return { id: docRef.id, ...invoiceWithNumber };
  } catch (error) {
    console.error('Error al crear factura:', error);
    throw new Error('Error al crear la factura: ' + error.message);
  }
},

 // En InvoiceService, agrega el método update:
async update(id, invoiceData) {
  try {
    if (!invoiceData.clientName) {
      throw new Error('Nombre del cliente es requerido');
    }
    
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
    const updatedInvoice = {
      ...invoiceData,
      subtotal: subtotal,
      total: subtotal,
      updatedAt: new Date().toISOString()
    };
    
    const docRef = doc(db, 'invoices', id);
    await updateDoc(docRef, updatedInvoice);
    return { id, ...updatedInvoice };
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    throw new Error('Error al actualizar la factura: ' + error.message);
  }
},
  async delete(id) {
    try {
      await deleteDoc(doc(db, 'invoices', id));
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      throw new Error('Error al eliminar la factura: ' + error.message);
    }
  }
};
