import { Toast } from '../ui/Toast.js';
import { ClientService, MaintenanceAssignmentService } from '../../data/firebaseService.js';

export class MaintenanceAssignmentForm {
  constructor(onSaveCallback, editingAssignment = null, onCancelCallback = null) {
    this.onSaveCallback = onSaveCallback;
    this.onCancelCallback = onCancelCallback;
    this.editingAssignment = editingAssignment;
    this.clients = [];
    this.filteredClients = [];
    this.selectedClient = null;
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'w-full max-w-4xl mx-auto';

    // Cargar clientes
    try {
      this.clients = await ClientService.getAll();
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.clients = [];
    }

    const formCard = document.createElement('div');
    formCard.className = 'bg-white rounded-xl border border-gray-200 shadow-lg p-6 sm:p-8';

    formCard.innerHTML = `
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">${this.editingAssignment ? '✏️ Editar Asignación' : '➕ Nueva Asignación'}</h2>
        <p class="text-gray-600 mt-2">${this.editingAssignment ? 'Actualiza los datos del servicio de mantenimiento' : 'Crea una nueva asignación de servicio recurrente'}</p>
      </div>
      
      <form id="maintenance-form" class="space-y-6">
        <!-- DATOS DEL CLIENTE -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200">
          <h3 class="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
            Cliente
          </h3>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Selecciona o crea un cliente *</label>
            <div class="relative">
              <input 
                type="text" 
                id="client-search" 
                placeholder="Escribe el nombre del cliente..." 
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors" 
                required
                autocomplete="off"
              >
              <div id="client-dropdown" class="hidden absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-56 overflow-y-auto mt-1">
                <!-- Opciones aparecen aquí dinámicamente -->
              </div>
            </div>
            <input type="hidden" id="client-id">
            <input type="hidden" id="client-phone">
            <input type="hidden" id="client-address">
          </div>
        </div>

        <!-- DETALLES DEL SERVICIO -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200">
          <h3 class="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h9m-9 4v10.5m9-10.5v10.5M7.5 7.5h5"/></svg>
            Servicio
          </h3>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Servicio *</label>
            <input type="text" id="service-name" placeholder="Ej: Limpieza de piscina" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors" required>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción del Servicio</label>
            <textarea id="description" placeholder="Detalles, materiales, especificaciones..." class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors" rows="2"></textarea>
          </div>
        </div>

        <!-- INFORMACIÓN DE FACTURACIÓN -->
        <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-5 border border-amber-200">
          <h3 class="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.433 7.418c.155-.103.346-.196.567-.267.221-.07.466-.106.714-.106.253 0 .498.037.72.11.224.074.415.175.589.301.174.126.324.277.442.456.119.18.206.38.259.598.053.219.081.456.081.709 0 .332-.035.643-.104.934-.068.291-.159.562-.269.810a4.616 4.616 0 00-.421.734c-.125.238-.206.466-.239.683-.033.217-.05.35-.05.39 0 .119.022.243.069.356a.62.62 0 00.167.279c.071.08.166.152.282.213a1.3 1.3 0 00.346.112c.111 0 .328-.016.9-.016.039 0 .089.013.152.04.062.027.11.067.151.12.042.052.082.134.119.237.039.103.075.226.106.373.031.148.053.317.067.507.015.19.023.405.023.656 0 .499-.035.967-.103 1.402-.067.435-.159.845-.274 1.23a6.144 6.144 0 01-.44 1.041c-.153.279-.331.526-.532.739.225.028.476.065.75.117.28.052.58.111.9.176.32.065.638.14.952.223.315.084.605.174.869.27-.152.216-.333.45-.543.703-.21.253-.414.518-.612.792-.199.275-.386.563-.559.863-.172.301-.331.602-.475.913a5.446 5.446 0 00-.534 1.039c-.173.439-.34.885-.5 1.337a5.11 5.11 0 01-.623 1.347c-.286.39-.605.678-.956.864-.351.186-.744.279-1.179.279-.347 0-.682-.055-1.003-.164-.32-.109-.611-.268-.874-.476-.262-.209-.48-.456-.653-.74-.174-.283-.305-.594-.389-.933-.084-.34-.126-.704-.126-1.093 0-.483.045-.936.134-1.358a6.332 6.332 0 00.354-1.257 5.582 5.582 0 00.494-1.422c.17-.542.265-1.074.288-1.595a2.818 2.818 0 00-.088-.529 1.022 1.022 0 00-.267-.436c-.12-.106-.267-.186-.438-.238a1.595 1.595 0 00-.506-.083c-.224 0-.414.016-.568.048-.154.032-.294.08-.419.143-.125.063-.229.142-.31.236-.082.094-.148.201-.198.32-.05.12-.082.253-.097.398-.016.145-.02.307-.016.486.003.18.008.372.016.575.008.203.02.405.037.606.017.2.04.39.068.567.028.177.06.34.095.491.035.15.073.278.112.383.04.104.073.181.098.232.025.05.044.084.056.1.008.014.009.028.005.043-.004.015-.027.04-.061.078-.035.037-.1.098-.192.182-.092.084-.205.19-.338.318-.133.129-.274.269-.42.418-.149.149-.294.3-.434.451-.14.15-.27.301-.39.451-.121.15-.227.295-.318.434-.091.14-.163.268-.216.382-.052.114-.088.203-.107.267a.697.697 0 00-.029.112.328.328 0 00.016.113c.011.037.032.074.062.11.031.037.078.073.14.107.062.034.146.066.25.095.103.03.222.057.355.078.133.021.277.037.429.047.151.011.306.016.462.016.159 0 .314-.005.468-.016z"/></svg>
            Facturación
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Monto Mensual (RD$) *</label>
              <div class="relative">
                <span class="absolute left-4 top-3 text-gray-600 font-semibold text-sm">RD$</span>
                <input type="number" id="amount" placeholder="0.00" min="0" step="0.01" class="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors" required>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Frecuencia *</label>
              <select id="frequency" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors" required>
                <option value="">Seleccionar...</option>
                <option value="monthly" selected>Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="annual">Anual</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <select id="is-active" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-colors">
                <option value="true" selected>✓ Activo</option>
                <option value="false">✗ Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <!-- RESUMEN Y BOTONES -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-5 text-white">
          <div class="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p class="text-sm text-blue-100">Monto Total a Facturar</p>
              <p class="text-3xl font-bold" id="total-amount">RD$0.00</p>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button type="submit" id="save-btn" class="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            ${this.editingAssignment ? 'Guardar Cambios' : 'Crear Asignación'}
          </button>
          <button type="button" id="cancel-btn" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200">
            Cancelar
          </button>
        </div>
      </form>
    `;

    container.appendChild(formCard);

    // Eventos
    setTimeout(() => {
      this.setupFormEvents(container);
      
      // Pre-cargar datos si se está editando
      if (this.editingAssignment) {
        this.preloadEditingAssignment(container);
      }

      // Actualizar total cuando cambia el monto
      const amountInput = container.querySelector('#amount');
      amountInput?.addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value) || 0;
        const totalSpan = container.querySelector('#total-amount');
        if (totalSpan) {
          totalSpan.textContent = `RD$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
      });
    }, 100);

    return container;
  }

  setupFormEvents(container) {
    const form = container.querySelector('#maintenance-form');
    if (!form) return;

    // Setup autocomplete del cliente
    this.setupClientAutocomplete(container);

    // Setup cancel button
    const cancelBtn = container.querySelector('#cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (this.onCancelCallback) {
          this.onCancelCallback();
        }
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSave(container);
    });
  }

  setupClientAutocomplete(container) {
    const searchInput = container.querySelector('#client-search');
    const dropdown = container.querySelector('#client-dropdown');
    const clientIdInput = container.querySelector('#client-id');
    const clientPhoneInput = container.querySelector('#client-phone');
    const clientAddressInput = container.querySelector('#client-address');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const searchText = e.target.value.toLowerCase().trim();
      
      if (searchText.length === 0) {
        dropdown.classList.add('hidden');
        clientIdInput.value = '';
        this.selectedClient = null;
        return;
      }

      // Filtrar clientes
      this.filteredClients = this.clients.filter(client =>
        client.name.toLowerCase().includes(searchText)
      );

      this.renderClientDropdown(dropdown, searchText, clientIdInput, clientPhoneInput, clientAddressInput, searchInput);
    });

    // Cerrar dropdown al hacer clic afuera
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  renderClientDropdown(dropdown, searchText, clientIdInput, clientPhoneInput, clientAddressInput, searchInput) {
    dropdown.innerHTML = '';

    // Mostrar clientes filtrados
    if (this.filteredClients.length > 0) {
      this.filteredClients.forEach(client => {
        const option = document.createElement('div');
        option.className = 'px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors';
        option.innerHTML = `
          <div class="font-semibold text-gray-900">${client.name}</div>
          <div class="text-xs text-gray-500">${client.phone || 'Sin teléfono'}</div>
        `;
        option.addEventListener('click', () => {
          searchInput.value = client.name;
          clientIdInput.value = client.id;
          clientPhoneInput.value = client.phone || '';
          clientAddressInput.value = client.address || '';
          this.selectedClient = client;
          dropdown.classList.add('hidden');
        });
        dropdown.appendChild(option);
      });
    }

    // Opción para crear nuevo cliente
    const createOption = document.createElement('div');
    createOption.className = 'px-4 py-3 bg-blue-50 hover:bg-blue-100 cursor-pointer font-semibold text-blue-600 border-t border-gray-200 transition-colors flex items-center gap-2';
    createOption.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Crear: "${searchText}"
    `;
    
    createOption.addEventListener('click', async () => {
      await this.createNewClient(searchText, clientIdInput, clientPhoneInput, clientAddressInput, searchInput, dropdown);
    });
    
    dropdown.appendChild(createOption);
    dropdown.classList.remove('hidden');
  }

  async createNewClient(name, clientIdInput, clientPhoneInput, clientAddressInput, searchInput, dropdown) {
    try {
      const newClient = await ClientService.create({
        name: name,
        phone: '',
        address: ''
      });

      // Agrega el nuevo cliente a la lista
      this.clients.push(newClient);
      
      // Actualiza los campos
      searchInput.value = name;
      clientIdInput.value = newClient.id;
      clientPhoneInput.value = '';
      clientAddressInput.value = '';
      this.selectedClient = newClient;
      
      dropdown.classList.add('hidden');
      Toast.show(`✓ Cliente "${name}" creado exitosamente`);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      Toast.showError('Error al crear cliente: ' + error.message);
    }
  }

  async handleSave(container) {
    const clientIdInput = container.querySelector('#client-id');
    const clientPhoneInput = container.querySelector('#client-phone');
    const clientAddressInput = container.querySelector('#client-address');
    const searchInput = container.querySelector('#client-search');
    const serviceName = container.querySelector('#service-name').value.trim();
    const description = container.querySelector('#description').value.trim();
    const amount = parseFloat(container.querySelector('#amount').value);
    const frequency = container.querySelector('#frequency').value;
    const isActive = container.querySelector('#is-active').value === 'true';

    if (!clientIdInput.value || !serviceName || !amount || !frequency) {
      Toast.showError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const clientId = clientIdInput.value;
      const clientName = searchInput.value;
      const clientPhone = clientPhoneInput.value;
      const clientAddress = clientAddressInput.value;

      const assignmentData = {
        clientId,
        clientName,
        clientPhone: clientPhone || '',
        clientAddress: clientAddress || '',
        serviceName,
        description,
        amount,
        frequency,
        isActive
      };

      if (this.editingAssignment) {
        // Editar asignación existente
        await MaintenanceAssignmentService.update(this.editingAssignment.id, assignmentData);
        Toast.show('✓ Asignación actualizada correctamente');
      } else {
        // Crear nueva asignación
        await MaintenanceAssignmentService.create(assignmentData);
        Toast.show('✓ Asignación creada exitosamente');
      }

      container.querySelector('#maintenance-form').reset();
      container.querySelector('#is-active').value = 'true';

      if (this.onSaveCallback) {
        this.onSaveCallback();
      }
    } catch (error) {
      console.error('Error al guardar asignación:', error);
      Toast.showError('Error: ' + error.message);
    }
  }

  async preloadEditingAssignment(container) {
    if (!this.editingAssignment) return;

    const searchInput = container.querySelector('#client-search');
    const clientIdInput = container.querySelector('#client-id');
    const clientPhoneInput = container.querySelector('#client-phone');
    const clientAddressInput = container.querySelector('#client-address');
    const serviceNameInput = container.querySelector('#service-name');
    const descriptionInput = container.querySelector('#description');
    const amountInput = container.querySelector('#amount');
    const frequencyInput = container.querySelector('#frequency');
    const isActiveInput = container.querySelector('#is-active');
    const totalSpan = container.querySelector('#total-amount');

    if (searchInput) {
      searchInput.value = this.editingAssignment.clientName;
      clientIdInput.value = this.editingAssignment.clientId;
      clientPhoneInput.value = this.editingAssignment.clientPhone || '';
      clientAddressInput.value = this.editingAssignment.clientAddress || '';
    }

    if (serviceNameInput) serviceNameInput.value = this.editingAssignment.serviceName;
    if (descriptionInput) descriptionInput.value = this.editingAssignment.description || '';
    if (amountInput) amountInput.value = this.editingAssignment.amount;
    if (frequencyInput) frequencyInput.value = this.editingAssignment.frequency;
    if (isActiveInput) isActiveInput.value = this.editingAssignment.isActive ? 'true' : 'false';

    // Actualizar total
    if (totalSpan) {
      totalSpan.textContent = `RD$${this.editingAssignment.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }
  }
}
