import { Toast } from '../ui/Toast.js';
import { ClientService, MaintenanceService } from '../../data/firebaseService.js';

export class MaintenanceForm {
  constructor(onSuccess) {
    this.onSuccess = onSuccess;
    this.clients = [];
    this.editingId = null;
  }

  async loadClients() {
    try {
      this.clients = await ClientService.getAll();
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      Toast.showError('Error al cargar los clientes');
    }
  }

  render(maintenanceData = null) {
    this.editingId = maintenanceData ? maintenanceData.id : null;
    
    const container = document.createElement('div');
    container.className = 'card';

    container.innerHTML = `
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          ${this.editingId ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
        </h2>

        <form id="maintenance-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
            <select id="client-select" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
              <option value="">Selecciona un cliente</option>
              ${this.clients.map(client => `
                <option value="${client.id}" data-name="${client.name}" data-phone="${client.phone || ''}" data-address="${client.address || ''}">
                  ${client.name}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Descripción del Servicio</label>
              <input type="text" id="service-description" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="Servicio de Mantenimiento" required>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Monto (RD$)</label>
              <input type="number" id="amount" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" step="0.01" min="0" required>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <input type="date" id="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="submit" class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              ${this.editingId ? 'Actualizar' : 'Crear'} Mantenimiento
            </button>
            <button type="reset" class="flex-1 px-4 py-2.5 bg-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-400 transition-colors">
              Limpiar
            </button>
          </div>
        </form>
      </div>
    `;

    const form = container.querySelector('#maintenance-form');
    const clientSelect = container.querySelector('#client-select');
    const dateInput = container.querySelector('#date');
    const amountInput = container.querySelector('#amount');
    const serviceInput = container.querySelector('#service-description');

    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Pre-cargar datos si estamos editando
    if (maintenanceData) {
      clientSelect.value = maintenanceData.clientId;
      serviceInput.value = maintenanceData.serviceDescription;
      amountInput.value = maintenanceData.amount;
      dateInput.value = maintenanceData.date;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const selectedOption = clientSelect.options[clientSelect.selectedIndex];
      const clientName = selectedOption.getAttribute('data-name');
      const clientPhone = selectedOption.getAttribute('data-phone');
      const clientAddress = selectedOption.getAttribute('data-address');

      const maintenanceData = {
        clientId: clientSelect.value,
        clientName: clientName,
        clientPhone: clientPhone,
        clientAddress: clientAddress,
        serviceDescription: serviceInput.value,
        amount: parseFloat(amountInput.value),
        date: dateInput.value
      };

      try {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Procesando...';

        if (this.editingId) {
          await MaintenanceService.update(this.editingId, maintenanceData);
          Toast.show('Mantenimiento actualizado exitosamente');
        } else {
          await MaintenanceService.create(maintenanceData);
          Toast.show('Mantenimiento creado exitosamente');
          form.reset();
          dateInput.value = today;
        }

        this.editingId = null;
        this.onSuccess();
      } catch (error) {
        Toast.showError(error.message);
      } finally {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = this.editingId ? 'Actualizar Mantenimiento' : 'Crear Mantenimiento';
      }
    });

    return container;
  }
}