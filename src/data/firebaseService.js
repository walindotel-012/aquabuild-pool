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
    
    const nextNumberStr = `COT-${nextNumber}`;
    
    // Validar que no exista un número duplicado
    const numberExists = quotes.some(q => q.number === nextNumberStr);
    if (numberExists) {
      throw new Error(`El número de cotización ${nextNumberStr} ya existe. Por favor intente nuevamente.`);
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
      number: nextNumberStr,
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
    
    const nextNumberStr = `FAC-${nextNumber}`;
    
    // Validar que no exista un número duplicado
    const numberExists = invoices.some(i => i.number === nextNumberStr);
    if (numberExists) {
      throw new Error(`El número de factura ${nextNumberStr} ya existe. Por favor intente nuevamente.`);
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
      number: nextNumberStr,
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

// Servicios de Mantenimiento
export const MaintenanceAssignmentService = {
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'maintenanceAssignments'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener asignaciones de mantenimiento:', error);
      throw new Error('No se pudieron cargar las asignaciones de mantenimiento');
    }
  },

  async getByClientId(clientId) {
    try {
      const all = await this.getAll();
      return all.filter(assignment => assignment.clientId === clientId);
    } catch (error) {
      console.error('Error al obtener asignaciones por cliente:', error);
      throw new Error('No se pudieron cargar las asignaciones');
    }
  },

  async create(assignmentData) {
    try {
      if (!assignmentData.clientId || !assignmentData.clientName) {
        throw new Error('Cliente es requerido');
      }
      if (!assignmentData.serviceName || !assignmentData.amount) {
        throw new Error('Nombre del servicio y monto son requeridos');
      }

      const assignment = {
        clientId: assignmentData.clientId,
        clientName: assignmentData.clientName,
        clientPhone: assignmentData.clientPhone || '',
        clientAddress: assignmentData.clientAddress || '',
        serviceName: assignmentData.serviceName,
        description: assignmentData.description || '',
        amount: parseFloat(assignmentData.amount),
        frequency: assignmentData.frequency || 'monthly', // monthly, quarterly, annual
        startDate: assignmentData.startDate,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'maintenanceAssignments'), assignment);
      return { id: docRef.id, ...assignment };
    } catch (error) {
      console.error('Error al crear asignación de mantenimiento:', error);
      throw new Error('Error al crear la asignación: ' + error.message);
    }
  },

  async update(id, assignmentData) {
    try {
      const docRef = doc(db, 'maintenanceAssignments', id);
      const updateData = {
        ...assignmentData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error al actualizar asignación:', error);
      throw new Error('Error al actualizar la asignación: ' + error.message);
    }
  },

  async delete(id) {
    try {
      await deleteDoc(doc(db, 'maintenanceAssignments', id));
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
      throw new Error('Error al eliminar la asignación: ' + error.message);
    }
  }
};

// Facturas de Mantenimiento
export const MaintenanceInvoiceService = {
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'maintenanceInvoices'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener facturas de mantenimiento:', error);
      throw new Error('No se pudieron cargar las facturas de mantenimiento');
    }
  },

  async getByMonth(year, month) {
    try {
      const all = await this.getAll();
      return all.filter(invoice => {
        const invoiceDate = new Date(invoice.generatedDate);
        return invoiceDate.getFullYear() === year && invoiceDate.getMonth() === month;
      });
    } catch (error) {
      console.error('Error al obtener facturas por mes:', error);
      throw new Error('No se pudieron cargar las facturas del mes');
    }
  },

  async getByClientIdAndMonth(clientId, year, month) {
    try {
      const all = await this.getAll();
      return all.filter(invoice => {
        const invoiceDate = new Date(invoice.generatedDate);
        return (
          invoice.clientId === clientId &&
          invoiceDate.getFullYear() === year &&
          invoiceDate.getMonth() === month
        );
      });
    } catch (error) {
      console.error('Error al obtener facturas del cliente:', error);
      throw new Error('No se pudieron cargar las facturas');
    }
  },

  async create(invoiceData) {
    try {
      if (!invoiceData.clientId || !invoiceData.clientName) {
        throw new Error('Cliente es requerido');
      }

      const invoices = await this.getAll();
      const lastInvoice = invoices
        .filter(i => i.number && i.number.startsWith('MTN-'))
        .sort((a, b) => {
          const numA = parseInt(a.number.replace('MTN-', '')) || 0;
          const numB = parseInt(b.number.replace('MTN-', '')) || 0;
          return numB - numA;
        })[0];

      let nextNumber;
      if (lastInvoice) {
        const lastNum = parseInt(lastInvoice.number.replace('MTN-', '')) || 30099;
        nextNumber = lastNum + 1;
      } else {
        nextNumber = 30100;
      }

      const nextNumberStr = `MTN-${nextNumber}`;

      const invoice = {
        clientId: invoiceData.clientId,
        clientName: invoiceData.clientName,
        clientPhone: invoiceData.clientPhone || '',
        clientAddress: invoiceData.clientAddress || '',
        assignmentId: invoiceData.assignmentId,
        serviceName: invoiceData.serviceName,
        amount: parseFloat(invoiceData.amount),
        number: nextNumberStr,
        generatedDate: invoiceData.generatedDate || new Date().toISOString(),
        dueDate: invoiceData.dueDate,
        isPaid: false,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'maintenanceInvoices'), invoice);
      return { id: docRef.id, ...invoice };
    } catch (error) {
      console.error('Error al crear factura de mantenimiento:', error);
      throw new Error('Error al crear la factura: ' + error.message);
    }
  },

  async update(id, invoiceData) {
    try {
      const docRef = doc(db, 'maintenanceInvoices', id);
      const updateData = {
        ...invoiceData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(docRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      throw new Error('Error al actualizar la factura: ' + error.message);
    }
  },

  async delete(id) {
    try {
      await deleteDoc(doc(db, 'maintenanceInvoices', id));
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      throw new Error('Error al eliminar la factura: ' + error.message);
    }
  },

  /**
   * Genera automáticamente facturas para todas las asignaciones activas
   * de acuerdo a su frecuencia
   */
  async generateMonthlyInvoices() {
    try {
      const assignments = await MaintenanceAssignmentService.getAll();
      const now = new Date();
      const generatedInvoices = [];

      for (const assignment of assignments) {
        if (!assignment.isActive) continue;

        const startDate = new Date(assignment.startDate);
        if (startDate > now) continue;

        // Verificar si ya existe factura para este mes
        const existingInvoices = await this.getByClientIdAndMonth(
          assignment.clientId,
          now.getFullYear(),
          now.getMonth()
        );

        // Filtrar por assignmentId para evitar duplicados
        const alreadyGenerated = existingInvoices.some(
          inv => inv.assignmentId === assignment.id
        );

        if (!alreadyGenerated && assignment.frequency === 'monthly') {
          // Crear factura
          const dueDate = new Date(now);
          dueDate.setDate(dueDate.getDate() + 15);

          await this.create({
            clientId: assignment.clientId,
            clientName: assignment.clientName,
            clientPhone: assignment.clientPhone,
            clientAddress: assignment.clientAddress,
            assignmentId: assignment.id,
            serviceName: assignment.serviceName,
            amount: assignment.amount,
            dueDate: dueDate.toISOString()
          });

          generatedInvoices.push(assignment.id);
        }
      }

      return generatedInvoices;
    } catch (error) {
      console.error('Error al generar facturas mensuales:', error);
      throw new Error('Error al generar facturas: ' + error.message);
    }
  }
};
