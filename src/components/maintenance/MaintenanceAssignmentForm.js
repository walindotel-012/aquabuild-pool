import { Toast } from '../ui/Toast.js';
import { ClientService, MaintenanceAssignmentService } from '../../data/firebaseService.js';

export class MaintenanceAssignmentForm {
  constructor(onSaveCallback) {
    this.onSaveCallback = onSaveCallback;
    this.clients = [];
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'space-y-6';

    // Cargar clientes
    try {
      this.clients = await ClientService.getAll();
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      this.clients = [];
    }

    const formCard = document.createElement('div');
    formCard.className = 'bg-white rounded-xl border border-gray-100 shadow-sm p-8';

    formCard.innerHTML = `
      <div class="border-b-4 border-blue-900 pb-6 mb-8">
        <h2 class="text-2xl font-bold text-blue-900 mb-1">ASIGNACIÓN DE MANTENIMIENTO</h2>
        <p class="text-sm text-gray-600">Asigna servicios de mantenimiento recurrentes a tus clientes</p>
      </div>
      
      <form id="maintenance-form" class="space-y-8">
        <!-- DATOS DEL CLIENTE -->
        <div class="border-l-4 border-blue-600 pl-6 py-4 bg-blue-50">
          <h3 class="text-lg font-bold text-blue-900 mb-4">DATOS DEL CLIENTE</h3>
          
          <div class="space-y-4">
            <!-- Cliente -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Cliente *</label>
              <select id="client-select" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" required>
                <option value="">Seleccionar cliente...</option>
                ${this.clients.map(client => `
                  <option value="${client.id}|${client.name}|${client.phone || ''}|${client.address || ''}">
                    ${client.name} - ${client.phone || 'Sin teléfono'}
                  </option>
                `).join('')}
              </select>
              ${this.clients.length === 0 ? '<p class="text-xs text-red-500 mt-2">No hay clientes disponibles. Crea uno primero.</p>' : ''}
            </div>
          </div>
        </div>

        <!-- DETALLES DEL SERVICIO -->
        <div class="border-l-4 border-green-600 pl-6 py-4 bg-green-50">
          <h3 class="text-lg font-bold text-green-900 mb-4">DETALLES DEL SERVICIO</h3>
          
          <div class="space-y-4">
            <!-- Nombre del Servicio -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Servicio *</label>
              <input type="text" id="service-name" placeholder="Ej: Limpieza mensual de piscina, Mantenimiento de bomba..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors" required>
            </div>

            <!-- Descripción -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción del Servicio</label>
              <textarea id="description" placeholder="Detalles adicionales, materiales, especificaciones..." class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors" rows="3"></textarea>
            </div>
          </div>
        </div>

        <!-- INFORMACIÓN DE FACTURACIÓN -->
        <div class="border-l-4 border-orange-600 pl-6 py-4 bg-orange-50">
          <h3 class="text-lg font-bold text-orange-900 mb-4">INFORMACIÓN DE FACTURACIÓN</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Monto Mensual -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Monto Mensual (RD$) *</label>
              <div class="relative">
                <span class="absolute left-4 top-3 text-gray-600 font-semibold">RD$</span>
                <input type="number" id="amount" placeholder="0.00" min="0" step="0.01" class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors" required>
              </div>
            </div>

            <!-- Frecuencia -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Frecuencia de Facturación *</label>
              <select id="frequency" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors" required>
                <option value="">Seleccionar...</option>
                <option value="monthly" selected>Mensual</option>
                <option value="quarterly">Trimestral</option>
                <option value="annual">Anual</option>
              </select>
            </div>

            <!-- Fecha de Inicio -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha de Inicio *</label>
              <input type="date" id="start-date" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition-colors" required>
            </div>
          </div>
        </div>

        <!-- RESUMEN -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-900 rounded-xl p-6 text-white">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm opacity-90">Monto Total a Facturar</p>
              <p class="text-3xl font-bold" id="total-amount">RD$0.00</p>
            </div>
            <div class="flex items-center gap-4">
              <input type="checkbox" id="is-active" checked class="w-5 h-5 cursor-pointer">
              <label for="is-active" class="text-sm font-medium cursor-pointer">Servicio activo</label>
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex gap-4 pt-6 border-t border-gray-200">
          <button type="submit" id="save-btn" class="flex-1 px-6 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Asignar Servicio
          </button>
          <button type="reset" id="reset-btn" class="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">
            Limpiar
          </button>
        </div>
      </form>
    `;

    container.appendChild(formCard);

    // Eventos
    setTimeout(() => {
      this.setupFormEvents(container);
      
      // Establecer la fecha de inicio a hoy
      const startDateInput = container.querySelector('#start-date');
      if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSave(container);
    });
  }

  async handleSave(container) {
    const clientSelect = container.querySelector('#client-select');
    const serviceName = container.querySelector('#service-name').value.trim();
    const description = container.querySelector('#description').value.trim();
    const amount = parseFloat(container.querySelector('#amount').value);
    const frequency = container.querySelector('#frequency').value;
    const startDate = container.querySelector('#start-date').value;
    const isActive = container.querySelector('#is-active').checked;

    if (!clientSelect.value || !serviceName || !amount || !frequency || !startDate) {
      Toast.showError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const [clientId, clientName, clientPhone, clientAddress] = clientSelect.value.split('|');

      const assignmentData = {
        clientId,
        clientName,
        clientPhone: clientPhone || '',
        clientAddress: clientAddress || '',
        serviceName,
        description,
        amount,
        frequency,
        startDate,
        isActive
      };

      await MaintenanceAssignmentService.create(assignmentData);
      
      Toast.show('✓ Servicio asignado correctamente');
      container.querySelector('#maintenance-form').reset();
      
      // Establecer fecha nuevamente
      const today = new Date().toISOString().split('T')[0];
      container.querySelector('#start-date').value = today;
      container.querySelector('#is-active').checked = true;

      if (this.onSaveCallback) {
        this.onSaveCallback();
      }
    } catch (error) {
      console.error('Error al guardar asignación:', error);
      Toast.showError('Error: ' + error.message);
    }
  }
}

