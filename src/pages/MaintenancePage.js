import { MaintenanceForm } from '../components/maintenance/MaintenanceForm.js';
import { MaintenanceList } from '../components/maintenance/MaintenanceList.js';

export class MaintenancePage {
  constructor(container) {
    this.container = container;
    this.form = null;
    this.list = null;
  }

  async render() {
    this.container.innerHTML = '';

    const mainContent = document.createElement('div');
    mainContent.className = 'space-y-6';

    // Crear formulario
    this.form = new MaintenanceForm(() => this.refreshList());
    await this.form.loadClients();

    // Crear lista
    this.list = new MaintenanceList(
      () => this.refreshList(),
      (data) => this.editMaintenance(data)
    );

    // Agregar formulario
    mainContent.appendChild(this.form.render());

    // Agregar lista
    mainContent.appendChild(this.list.render());

    this.container.appendChild(mainContent);
  }

  async refreshList() {
    // Recargar la página completa para actualizar tanto el formulario como la lista
    this.render();
  }

  editMaintenance(maintenanceData) {
    // Scroll al formulario
    const formElement = this.container.querySelector('#maintenance-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }

    // Cargar formulario en modo edición
    const mainContent = this.container.querySelector('.space-y-6');
    const oldForm = mainContent.querySelector('.card');
    
    this.form = new MaintenanceForm(() => this.refreshList());
    this.form.loadClients().then(() => {
      if (oldForm) {
        oldForm.replaceWith(this.form.render(maintenanceData));
      }
    });
  }
}