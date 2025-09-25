// src/data/clients.js
import { Storage } from './storage.js';

export const ClientService = {
  getAll() {
    return Storage.getClients();
  },
  
  getById(id) {
    const clients = this.getAll();
    return clients.find(client => client.id === id);
  },
  
  create(clientData) {
    const clients = this.getAll();
    const newClient = {
      id: Date.now().toString(),
      ...clientData
    };
    clients.push(newClient);
    Storage.saveClients(clients);
    return newClient;
  },
  
  update(id, clientData) {
    const clients = this.getAll();
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...clientData };
      Storage.saveClients(clients);
      return clients[index];
    }
    return null;
  },
  
  delete(id) {
    const clients = this.getAll();
    const filtered = clients.filter(client => client.id !== id);
    Storage.saveClients(filtered);
    return filtered.length !== clients.length;
  }
};