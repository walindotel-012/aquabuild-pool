import { Toast } from '../components/ui/Toast.js';
import { Modal } from '../components/ui/Modal.js';
import { MaintenanceInvoiceService, MaintenanceAssignmentService } from '../data/firebaseService.js';
import { formatCurrencyRD, formatDate, generateWhatsAppMessageURL } from '../utils/helpers.js';
import { DocumentPDF } from '../components/documents/DocumentPDF.js';
import { MaintenanceAssignmentForm } from '../components/maintenance/MaintenanceAssignmentForm.js';

export class MaintenancePage {
  constructor() {
    this.currentMonth = new Date();
    this.invoices = [];
    this.invoicesFiltered = [];
    this.assignments = [];
    this.assignmentsFiltered = [];
    this.invoicesSection = null;
    this.isLoadingInvoices = false; // Flag para prevenir múltiples cargas simultáneas
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    // Navigation buttons - Mejorado
    const navDiv = document.createElement('div');
    navDiv.className = 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 shadow-sm';
    navDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row gap-3 items-center justify-start">
        <button id="nav-assignments" class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 text-sm shadow-md hover:shadow-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M11 10h.01M7 10h.01M6 20h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          Asignaciones
        </button>
        <button id="nav-invoices" class="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center gap-2 text-sm hover:shadow-md">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Facturas
        </button>
      </div>
    `;
    container.appendChild(navDiv);

    // Section 1: Assignments
    const assignmentsSection = document.createElement('div');
    assignmentsSection.id = 'assignments-section';
    assignmentsSection.className = 'space-y-6';

    const addBtnDiv = document.createElement('div');
    addBtnDiv.className = 'flex justify-between items-center';
    addBtnDiv.innerHTML = `
      <h2 class="text-xl font-bold text-gray-900">Asignaciones de Mantenimiento</h2>
      <button id="toggle-form" class="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 text-sm shadow-md hover:shadow-lg">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
        Nueva Asignación
      </button>
    `;
    assignmentsSection.appendChild(addBtnDiv);

    const formContainer = document.createElement('div');
    formContainer.id = 'form-container';
    formContainer.className = 'hidden';
    assignmentsSection.appendChild(formContainer);

    try {
      await this.loadAssignments();
      const filtersDiv = this.renderAssignmentFilters();
      assignmentsSection.appendChild(filtersDiv);
      const listElement = await this.renderAssignments();
      assignmentsSection.appendChild(listElement);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }

    container.appendChild(assignmentsSection);

    // Section 2: Invoices
    const invoicesSection = document.createElement('div');
    invoicesSection.id = 'invoices-section';
    invoicesSection.className = 'hidden space-y-6';
    this.invoicesSection = invoicesSection;

    const filterDiv = document.createElement('div');
    filterDiv.className = 'bg-white rounded-xl p-6 border border-gray-100 shadow-sm';
    filterDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="flex items-center gap-4">
          <label class="text-sm font-semibold text-gray-700">Mes:</label>
          <div class="flex items-center gap-2">
            <button id="prev-month" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <input type="month" id="month-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value="${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}">
            <button id="next-month" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
        <button id="generate-invoices" class="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Generar Facturas
        </button>
      </div>
    `;
    invoicesSection.appendChild(filterDiv);

    try {
      await this.loadInvoices();
      
      // Add invoice filters
      const invoiceFilters = this.renderInvoiceFilters();
      invoicesSection.appendChild(invoiceFilters);
      
      const invoicesList = await this.renderInvoices();
      invoicesSection.appendChild(invoicesList);
    } catch (error) {
      console.error('Error loading invoices:', error);
    }

    container.appendChild(invoicesSection);

    // Setup events immediately without setTimeout
    this.setupNavigation(container);
    this.setupFormToggle(container);
    this.setupFilterEvents(container);
    this.setupGenerateButton(container);

    return container;
  }

  setupNavigation(container) {
    const navAssignmentsBtn = container.querySelector('#nav-assignments');
    const navInvoicesBtn = container.querySelector('#nav-invoices');
    const assignmentsSection = container.querySelector('#assignments-section');
    const invoicesSection = container.querySelector('#invoices-section');

    navAssignmentsBtn?.addEventListener('click', () => {
      navAssignmentsBtn.className = 'px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2';
      navInvoicesBtn.className = 'px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2';
      assignmentsSection.classList.remove('hidden');
      invoicesSection.classList.add('hidden');
    });

    navInvoicesBtn?.addEventListener('click', () => {
      navInvoicesBtn.className = 'px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2';
      navAssignmentsBtn.className = 'px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2';
      invoicesSection.classList.remove('hidden');
      assignmentsSection.classList.add('hidden');
    });
  }

  setupFormToggle(container) {
    const toggleBtn = container.querySelector('#toggle-form');
    const formContainer = container.querySelector('#form-container');
    const self = this;

    toggleBtn?.addEventListener('click', async () => {
      if (formContainer.classList.contains('hidden')) {
        formContainer.classList.remove('hidden');
        if (formContainer.children.length === 0) {
          const closeForm = () => {
            formContainer.classList.add('hidden');
            formContainer.innerHTML = '';
          };

          const form = new MaintenanceAssignmentForm(() => {
            self.loadAssignments().then(() => {
              // Buscar el elemento actual en el DOM, no en el closure
              const currentAssignmentsList = document.querySelector('#assignments-list');
              if (currentAssignmentsList) {
                self.renderAssignments().then(newList => {
                  currentAssignmentsList.replaceWith(newList);
                });
              }
            });
            Toast.show('Asignación guardada');
            closeForm();
          }, null, closeForm);
          const formElement = await form.render();
          formContainer.appendChild(formElement);
        }
      } else {
        formContainer.classList.add('hidden');
      }
    });
  }

  async loadAssignments() {
    try {
      this.assignments = await MaintenanceAssignmentService.getAll();
      this.assignmentsFiltered = [...this.assignments]; // Copia para filtrado
    } catch (error) {
      console.error('Error loading assignments:', error);
      this.assignments = [];
      this.assignmentsFiltered = [];
    }
  }

  async renderAssignments() {
    const listContainer = document.createElement('div');
    listContainer.id = 'assignments-list';

    if (this.assignmentsFiltered.length === 0) {
      listContainer.className = 'bg-gray-50 border border-gray-200 rounded-lg p-12 text-center';
      const message = this.assignments.length === 0 ? 'No hay asignaciones. Crea una nueva.' : 'No hay resultados que coincidan con los filtros.';
      listContainer.innerHTML = `<p class="text-gray-600">${message}</p>`;
      return listContainer;
    }

    listContainer.className = 'space-y-4';
    const self = this;

    for (const assignment of this.assignmentsFiltered) {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl border border-gray-100 shadow-sm p-6';
      card.id = `assignment-${assignment.id}`;

      const createdDate = new Date(assignment.createdAt);
      const freqMap = { monthly: 'Mensual', quarterly: 'Trimestral', annual: 'Anual' };

      card.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-4">
          <div><span class="text-xs font-semibold text-gray-600">CLIENTE</span><br><span class="font-semibold">${assignment.clientName}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">SERVICIO</span><br><span class="text-blue-600 font-semibold">${assignment.serviceName}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">MONTO</span><br><span class="font-bold">${formatCurrencyRD(assignment.amount)}</span><br><span class="text-xs text-gray-600">${freqMap[assignment.frequency] || assignment.frequency}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">DESDE</span><br><span class="font-semibold">${formatDate(createdDate)}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">ESTADO</span><br><span class="inline-block px-2 py-1 rounded text-xs font-semibold ${assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${assignment.isActive ? 'Activo' : 'Inactivo'}</span></div>
        </div>
        <div class="flex gap-2 pt-4 border-t">
          <button type="button" class="edit-assignment px-3 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition-colors">
            Editar
          </button>
          <button type="button" class="toggle-status px-3 py-2 text-sm rounded-lg transition-colors ${assignment.isActive ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}">
            ${assignment.isActive ? 'Desactivar' : 'Activar'}
          </button>
          <button type="button" class="delete-assignment px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">
            Eliminar
          </button>
        </div>
      `;

      const editBtn = card.querySelector('.edit-assignment');
      editBtn?.addEventListener('click', async () => {
        const formContainer = document.querySelector('#form-container');
        if (formContainer) {
          formContainer.innerHTML = ''; // Limpiar formulario anterior
          
          const closeForm = () => {
            formContainer.classList.add('hidden');
            formContainer.innerHTML = '';
          };

          const form = new MaintenanceAssignmentForm(() => {
            self.loadAssignments().then(() => {
              const currentAssignmentsList = document.querySelector('#assignments-list');
              if (currentAssignmentsList) {
                self.renderAssignments().then(newList => {
                  currentAssignmentsList.replaceWith(newList);
                });
              }
            });
            Toast.show('Asignación actualizada');
            closeForm();
          }, assignment, closeForm); // Pasar la asignación para editar y callback de cierre
          const formElement = await form.render();
          formContainer.appendChild(formElement);
          formContainer.classList.remove('hidden');
          
          // Scroll al formulario
          formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      const toggleBtn = card.querySelector('.toggle-status');
      toggleBtn?.addEventListener('click', async () => {
        try {
          const newStatus = !assignment.isActive;
          await MaintenanceAssignmentService.update(assignment.id, { isActive: newStatus });
          Toast.show(`Asignación ${newStatus ? 'activada' : 'desactivada'}`);
          // Update local state
          assignment.isActive = newStatus;
          // Update UI
          const statusSpan = card.querySelector('span.inline-block');
          statusSpan.className = `inline-block px-2 py-1 rounded text-xs font-semibold ${newStatus ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`;
          statusSpan.textContent = newStatus ? 'Activo' : 'Inactivo';
          toggleBtn.className = `toggle-status px-3 py-2 text-sm rounded-lg transition-colors ${newStatus ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`;
          toggleBtn.textContent = newStatus ? 'Desactivar' : 'Activar';
        } catch (error) {
          Toast.showError('Error: ' + error.message);
        }
      });

      const deleteBtn = card.querySelector('.delete-assignment');
      deleteBtn?.addEventListener('click', async () => {
        const confirmed = await Modal.confirmDelete(`Eliminar asignación de ${assignment.clientName}? Esta acción no se puede deshacer.`);
        if (confirmed) {
          try {
            await MaintenanceAssignmentService.delete(assignment.id);
            Toast.show('Asignación eliminada');
            card.remove();
          } catch (error) {
            Toast.showError('Error: ' + error.message);
          }
        }
      });

      listContainer.appendChild(card);
    }

    return listContainer;
  }

  renderAssignmentFilters() {
    const filterDiv = document.createElement('div');
    filterDiv.className = 'bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4';
    filterDiv.innerHTML = `
      <h3 class="font-bold text-gray-900 mb-4">Filtros</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar Cliente</label>
          <input type="text" id="filter-client" placeholder="Nombre del cliente..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar Servicio</label>
          <input type="text" id="filter-service" placeholder="Nombre del servicio..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
          <select id="filter-status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">&nbsp;</label>
          <button id="clear-filters" class="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Limpiar Filtros
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.setupAssignmentFilterEvents(filterDiv);
    }, 100);

    return filterDiv;
  }

  setupAssignmentFilterEvents(filterDiv) {
    const clientInput = filterDiv.querySelector('#filter-client');
    const serviceInput = filterDiv.querySelector('#filter-service');
    const statusSelect = filterDiv.querySelector('#filter-status');
    const clearBtn = filterDiv.querySelector('#clear-filters');
    const self = this;

    const applyFilters = async () => {
      const clientText = clientInput.value.toLowerCase().trim();
      const serviceText = serviceInput.value.toLowerCase().trim();
      const status = statusSelect.value;

      this.assignmentsFiltered = this.assignments.filter(assignment => {
        const matchesClient = assignment.clientName.toLowerCase().includes(clientText);
        const matchesService = assignment.serviceName.toLowerCase().includes(serviceText);
        const matchesStatus = status === '' || (status === 'active' ? assignment.isActive : !assignment.isActive);

        return matchesClient && matchesService && matchesStatus;
      });

      // Actualizar lista en el DOM - reemplazar solo la lista, no el parent
      const currentAssignmentsList = document.querySelector('#assignments-list');
      if (currentAssignmentsList) {
        const newList = await self.renderAssignments();
        currentAssignmentsList.replaceWith(newList);
      }
    };

    clientInput?.addEventListener('input', applyFilters);
    serviceInput?.addEventListener('input', applyFilters);
    statusSelect?.addEventListener('change', applyFilters);
    clearBtn?.addEventListener('click', () => {
      clientInput.value = '';
      serviceInput.value = '';
      statusSelect.value = '';
      applyFilters();
    });
  }

  async loadInvoices() {
    try {
      const year = this.currentMonth.getFullYear();
      const month = this.currentMonth.getMonth();
      this.invoices = await MaintenanceInvoiceService.getByMonth(year, month);
      this.invoicesFiltered = [...this.invoices]; // Copia para filtrado
    } catch (error) {
      console.error('Error loading invoices:', error);
      this.invoices = [];
      this.invoicesFiltered = [];
    }
  }

  async renderInvoices() {
    const listContainer = document.createElement('div');
    listContainer.id = 'invoices-list';

    if (this.invoicesFiltered.length === 0) {
      listContainer.className = 'bg-gray-50 border border-gray-200 rounded-lg p-12 text-center';
      const message = this.invoices.length === 0 ? 'Sin facturas para este mes.' : 'No hay resultados que coincidan con los filtros.';
      listContainer.innerHTML = `<p class="text-gray-600">${message}</p>`;
      return listContainer;
    }

    listContainer.className = 'space-y-4';
    const self = this;

    for (const invoice of this.invoicesFiltered) {
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl border border-gray-100 shadow-sm p-6';
      card.id = `invoice-${invoice.id}`;

      const generatedDate = new Date(invoice.generatedDate);
      const dueDate = new Date(invoice.dueDate);
      const statusClass = invoice.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
      const statusText = invoice.isPaid ? 'Pagada' : 'Pendiente';

      card.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          <div><span class="text-xs font-semibold text-gray-600">CLIENTE</span><br><span class="font-semibold">${invoice.clientName}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">FACTURA</span><br><span class="text-blue-600 font-bold">${invoice.number}</span><br><span class="text-xs text-gray-600">${invoice.serviceName}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">MONTO</span><br><span class="font-bold">${formatCurrencyRD(invoice.amount)}</span><br><span class="text-xs text-gray-500">${formatDate(generatedDate)}</span></div>
          <div><span class="text-xs font-semibold text-gray-600">ESTADO</span><br><span class="inline-block px-2 py-1 rounded text-xs font-semibold ${statusClass}">${statusText}</span><br><span class="text-xs text-gray-500 mt-1">Vence: ${formatDate(dueDate)}</span></div>
        </div>
        <div class="flex flex-wrap gap-2 pt-4 border-t">
          <button type="button" class="pdf-invoice px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">PDF</button>
          <button type="button" class="whatsapp-invoice px-3 py-2 bg-green-50 text-green-600 text-sm rounded-lg hover:bg-green-100 transition-colors">WhatsApp</button>
          <button type="button" class="mark-paid px-3 py-2 ${invoice.isPaid ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-green-50 text-green-600 hover:bg-green-100'} text-sm rounded-lg transition-colors">
            ${invoice.isPaid ? 'Pagada' : 'Marcar Pagada'}
          </button>
          <button type="button" class="delete-invoice px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">Eliminar</button>
        </div>
      `;

      const pdfBtn = card.querySelector('.pdf-invoice');
      pdfBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        await self.generateAndDownloadPDF(invoice);
      });

      const whatsappBtn = card.querySelector('.whatsapp-invoice');
      whatsappBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        await self.shareViaWhatsAppWithPDF(invoice);
      });

      const markPaidBtn = card.querySelector('.mark-paid');
      markPaidBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!invoice.isPaid) {
          try {
            await MaintenanceInvoiceService.update(invoice.id, { isPaid: true });
            Toast.show('Factura marcada como pagada');
            // Update local state
            invoice.isPaid = true;
            // Update UI
            card.innerHTML = `
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div><span class="text-xs font-semibold text-gray-600">CLIENTE</span><br><span class="font-semibold">${invoice.clientName}</span></div>
                <div><span class="text-xs font-semibold text-gray-600">FACTURA</span><br><span class="text-blue-600 font-bold">${invoice.number}</span><br><span class="text-xs text-gray-600">${invoice.serviceName}</span></div>
                <div><span class="text-xs font-semibold text-gray-600">MONTO</span><br><span class="font-bold">${formatCurrencyRD(invoice.amount)}</span><br><span class="text-xs text-gray-500">${formatDate(generatedDate)}</span></div>
                <div><span class="text-xs font-semibold text-gray-600">ESTADO</span><br><span class="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">Pagada</span><br><span class="text-xs text-gray-500 mt-1">Vence: ${formatDate(dueDate)}</span></div>
              </div>
              <div class="flex flex-wrap gap-2 pt-4 border-t">
                <button type="button" class="pdf-invoice px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">PDF</button>
                <button type="button" class="whatsapp-invoice px-3 py-2 bg-green-50 text-green-600 text-sm rounded-lg hover:bg-green-100 transition-colors">WhatsApp</button>
                <button type="button" class="mark-paid px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed text-sm rounded-lg transition-colors">Pagada</button>
                <button type="button" class="delete-invoice px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors">Eliminar</button>
              </div>
            `;
            // Re-attach event listeners
            card.querySelector('.pdf-invoice')?.addEventListener('click', async (e) => {
              e.preventDefault();
              await self.generateAndDownloadPDF(invoice);
            });
            card.querySelector('.whatsapp-invoice')?.addEventListener('click', async (e) => {
              e.preventDefault();
              await self.shareViaWhatsAppWithPDF(invoice);
            });
            card.querySelector('.delete-invoice')?.addEventListener('click', async (e) => {
              e.preventDefault();
              const confirmed = await Modal.confirmDelete(`Eliminar factura ${invoice.number}? Esta acción no se puede deshacer.`);
              if (confirmed) {
                try {
                  await MaintenanceInvoiceService.delete(invoice.id);
                  Toast.show('Factura eliminada');
                  card.remove();
                } catch (error) {
                  Toast.showError('Error: ' + error.message);
                }
              }
            });
          } catch (error) {
            Toast.showError('Error: ' + error.message);
          }
        }
      });

      const deleteBtn = card.querySelector('.delete-invoice');
      deleteBtn?.addEventListener('click', async (e) => {
        e.preventDefault();
        const confirmed = await Modal.confirmDelete(`Eliminar factura ${invoice.number}? Esta acción no se puede deshacer.`);
        if (confirmed) {
          try {
            await MaintenanceInvoiceService.delete(invoice.id);
            Toast.show('Factura eliminada');
            card.remove();
          } catch (error) {
            Toast.showError('Error: ' + error.message);
          }
        }
      });

      listContainer.appendChild(card);
    }

    return listContainer;
  }

  renderInvoiceFilters() {
    const filterDiv = document.createElement('div');
    filterDiv.className = 'bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4';
    filterDiv.innerHTML = `
      <h3 class="font-bold text-gray-900 mb-4">Filtros</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar Cliente</label>
          <input type="text" id="filter-invoice-client" placeholder="Nombre del cliente..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar Factura</label>
          <input type="text" id="filter-invoice-number" placeholder="Número de factura..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
          <select id="filter-invoice-status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
            <option value="">Todas</option>
            <option value="paid">Pagada</option>
            <option value="pending">Pendiente</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">&nbsp;</label>
          <button id="clear-invoice-filters" class="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
            Limpiar Filtros
          </button>
        </div>
      </div>
    `;

    setTimeout(() => {
      this.setupInvoiceFilterEvents(filterDiv);
    }, 100);

    return filterDiv;
  }

  setupInvoiceFilterEvents(filterDiv) {
    const clientInput = filterDiv.querySelector('#filter-invoice-client');
    const numberInput = filterDiv.querySelector('#filter-invoice-number');
    const statusSelect = filterDiv.querySelector('#filter-invoice-status');
    const clearBtn = filterDiv.querySelector('#clear-invoice-filters');
    const self = this;

    const applyFilters = async () => {
      const clientText = clientInput.value.toLowerCase().trim();
      const numberText = numberInput.value.toLowerCase().trim();
      const status = statusSelect.value;

      this.invoicesFiltered = this.invoices.filter(invoice => {
        const matchesClient = invoice.clientName.toLowerCase().includes(clientText);
        const matchesNumber = invoice.number.toLowerCase().includes(numberText);
        const matchesStatus = status === '' || (status === 'paid' ? invoice.isPaid : !invoice.isPaid);

        return matchesClient && matchesNumber && matchesStatus;
      });

      // Actualizar lista en el DOM - reemplazar solo la lista, no el parent
      const currentInvoicesList = document.querySelector('#invoices-list');
      if (currentInvoicesList) {
        const newList = await self.renderInvoices();
        currentInvoicesList.replaceWith(newList);
      }
    };

    clientInput?.addEventListener('input', applyFilters);
    numberInput?.addEventListener('input', applyFilters);
    statusSelect?.addEventListener('change', applyFilters);
    clearBtn?.addEventListener('click', () => {
      clientInput.value = '';
      numberInput.value = '';
      statusSelect.value = '';
      applyFilters();
    });
  }

  async generateAndDownloadPDF(invoice) {
    try {
      Toast.show('Generando PDF...');
      const doc = DocumentPDF.generateMaintenanceInvoicePDF(invoice);
      doc.save(`${invoice.number}.pdf`);
      Toast.show('PDF generado');
    } catch (error) {
      Toast.showError('Error: ' + error.message);
    }
  }

  async shareViaWhatsApp(invoice) {
    try {
      const message = `Hola ${invoice.clientName},\nTu factura de mantenimiento ${invoice.number} está lista.\nMonto: ${formatCurrencyRD(invoice.amount)}\nVence: ${formatDate(new Date(invoice.dueDate))}`;
      const whatsappUrl = generateWhatsAppMessageURL(invoice.clientPhone, message);
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
        Toast.show('Abierto WhatsApp');
      }
    } catch (error) {
      Toast.showError('Error: ' + error.message);
    }
  }

  async shareViaWhatsAppWithPDF(invoice) {
    try {
      Toast.show('⏳ Preparando PDF para compartir...');
      const doc = DocumentPDF.generateMaintenanceInvoicePDF(invoice);
      const pdfBlob = doc.output('blob');
      const fileName = `Factura_${invoice.number}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Try to use Web Share API (disponible en móviles y navegadores modernos)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Factura de Mantenimiento ${invoice.number}`,
            text: `Hola ${invoice.clientName}, adjunto tu factura de mantenimiento.\n\nMonto: ${formatCurrencyRD(invoice.amount)}\nVence: ${formatDate(new Date(invoice.dueDate))}`,
            files: [file]
          });
          Toast.show('✓ Compartido exitosamente');
        } catch (error) {
          if (error.name !== 'AbortError') {
            throw error;
          }
        }
      } else {
        // Fallback: Abrir WhatsApp con mensaje de texto y descargar PDF por separado
        const message = `Hola ${invoice.clientName},\nTu factura de mantenimiento ${invoice.number} está lista.\nMonto: ${formatCurrencyRD(invoice.amount)}\nVence: ${formatDate(new Date(invoice.dueDate))}\n\nDescarga el PDF en el enlace anterior.`;
        const whatsappUrl = generateWhatsAppMessageURL(invoice.clientPhone, message);
        
        // Descargar PDF
        doc.save(fileName);
        
        if (whatsappUrl) {
          // Abrir WhatsApp después de un breve retraso
          setTimeout(() => {
            window.open(whatsappUrl, '_blank');
          }, 500);
          Toast.show('✓ PDF descargado. Abierto WhatsApp');
        }
      }
    } catch (error) {
      console.error('Error al compartir por WhatsApp:', error);
      Toast.showError('Error: ' + error.message);
    }
  }

  setupFilterEvents(container) {
    const monthInput = container.querySelector('#month-filter');
    const prevBtn = container.querySelector('#prev-month');
    const nextBtn = container.querySelector('#next-month');

    const updateInvoicesList = async () => {
      // Prevenir múltiples actualizaciones simultáneas
      if (this.isLoadingInvoices) return;
      
      this.isLoadingInvoices = true;
      try {
        await this.loadInvoices();
        
        // Buscar el contenedor actual
        const invoicesContainer = document.querySelector('#invoices-section');
        if (!invoicesContainer) return;
        
        const oldInvoicesList = invoicesContainer.querySelector('#invoices-list');
        if (oldInvoicesList) {
          const newInvoicesList = await this.renderInvoices();
          oldInvoicesList.replaceWith(newInvoicesList);
        }
      } catch (error) {
        console.error('Error al actualizar facturas:', error);
      } finally {
        this.isLoadingInvoices = false;
      }
    };

    monthInput?.addEventListener('change', (e) => {
      const [year, month] = e.target.value.split('-');
      this.currentMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
      updateInvoicesList();
    });

    prevBtn?.addEventListener('click', () => {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
      monthInput.value = `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`;
      updateInvoicesList();
    });

    nextBtn?.addEventListener('click', () => {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
      monthInput.value = `${this.currentMonth.getFullYear()}-${String(this.currentMonth.getMonth() + 1).padStart(2, '0')}`;
      updateInvoicesList();
    });
  }

  setupGenerateButton(container) {
    const generateBtn = container.querySelector('#generate-invoices');
    generateBtn?.addEventListener('click', async () => {
      try {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="animate-spin">⏳</span> Generando...';

        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        
        const generated = await MaintenanceInvoiceService.generateMonthlyInvoices(year, month);

        if (generated.length > 0) {
          Toast.show(`${generated.length} factura(s) generada(s)`);
          // Reload invoices list in real-time without page refresh
          await this.loadInvoices();
          
          // Find and replace the invoices list container
          const oldInvoicesList = this.invoicesSection?.querySelector('#invoices-list');
          if (oldInvoicesList) {
            const newInvoicesList = await this.renderInvoices();
            oldInvoicesList.replaceWith(newInvoicesList);
          }
        } else {
          Toast.show('No hay nuevas asignaciones');
        }
      } catch (error) {
        Toast.showError('Error: ' + error.message);
      } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Generar Facturas
        `;
      }
    });
  }
}
