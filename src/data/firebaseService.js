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
      console.log('Obteniendo clientes de Firestore...');
      const querySnapshot = await getDocs(collection(db, 'clients'));
      const clients = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Clientes obtenidos:', clients);
      return clients;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw new Error('No se pudieron cargar los clientes');
    }
  },
  
  async getById(id) {
    try {
      const docRef = doc(db, 'clients', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      throw new Error('No se pudo cargar el cliente');
    }
  },
  
  async create(clientData) {
    try {
      console.log('Creando cliente:', clientData);
      
      if (!clientData.name || !clientData.phone) {
        throw new Error('Nombre y teléfono son requeridos');
      }
      
      const docRef = await addDoc(collection(db, 'clients'), {
        ...clientData,
        createdAt: new Date().toISOString()
      });
      
      const newClient = { id: docRef.id, ...clientData };
      console.log('Cliente creado exitosamente:', newClient);
      return newClient;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw new Error('Error al crear el cliente: ' + error.message);
    }
  },
  
  async update(id, clientData) {
    try {
      console.log('Actualizando cliente:', id, clientData);
      
      if (!clientData.name || !clientData.phone) {
        throw new Error('Nombre y teléfono son requeridos');
      }
      
      const docRef = doc(db, 'clients', id);
      await updateDoc(docRef, clientData);
      
      console.log('Cliente actualizado exitosamente');
      return { id, ...clientData };
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw new Error('Error al actualizar el cliente: ' + error.message);
    }
  },
  
  async delete(id) {
    try {
      console.log('Eliminando cliente:', id);
      await deleteDoc(doc(db, 'clients', id));
      console.log('Cliente eliminado exitosamente');
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
      console.log('Obteniendo cotizaciones de Firestore...');
      const querySnapshot = await getDocs(collection(db, 'quotes'));
      const quotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Cotizaciones obtenidas:', quotes);
      return quotes;
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      throw new Error('No se pudieron cargar las cotizaciones');
    }
  },
  
  async create(quoteData) {
    try {
      console.log('Creando cotización:', quoteData);
      
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
      const newQuote = { id: docRef.id, ...quoteWithNumber };
      console.log('Cotización creada exitosamente:', newQuote);
      return newQuote;
    } catch (error) {
      console.error('Error al crear cotización:', error);
      throw new Error('Error al crear la cotización: ' + error.message);
    }
  },
  
  async delete(id) {
    try {
      console.log('Eliminando cotización:', id);
      await deleteDoc(doc(db, 'quotes', id));
      console.log('Cotización eliminada exitosamente');
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
      console.log('Obteniendo facturas de Firestore...');
      const querySnapshot = await getDocs(collection(db, 'invoices'));
      const invoices = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Facturas obtenidas:', invoices);
      return invoices;
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      throw new Error('No se pudieron cargar las facturas');
    }
  },
  
  async create(invoiceData) {
    try {
      console.log('Creando factura:', invoiceData);
      
      // Obtener el siguiente número de factura
      const invoices = await this.getAll();
      const counter = invoices.length + 1;
      const invoiceWithNumber = {
        ...invoiceData,
        number: `FAC-${counter.toString().padStart(4, '0')}`,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'invoices'), invoiceWithNumber);
      const newInvoice = { id: docRef.id, ...invoiceWithNumber };
      console.log('Factura creada exitosamente:', newInvoice);
      return newInvoice;
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw new Error('Error al crear la factura: ' + error.message);
    }
  },
  
  async delete(id) {
    try {
      console.log('Eliminando factura:', id);
      await deleteDoc(doc(db, 'invoices', id));
      console.log('Factura eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      throw new Error('Error al eliminar la factura: ' + error.message);
    }
  }
};