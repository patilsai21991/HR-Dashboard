// src/layouts/dashboard/dashboard.js
import { UserList } from '../../components/userList/userList';
import { SalaryModule } from '../../components/salaryModule/salaryModule';
import { renderComponent } from '../../utils/domInjector';
import { apiService } from '../../services/apiService';

/**
 * @class Dashboard
 * @description Represents the main dashboard layout, orchestrating various components.
 */
export class Dashboard {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'dashboard-container';
    this.userListContainer = document.createElement('div');
    this.userListContainer.id = 'user-list-container';
    this.salaryModuleContainer = document.createElement('div');
    this.salaryModuleContainer.id = 'salary-module-container';
  }

  /**
   * @method render
   * @description Renders the main dashboard layout and injects sub-components.
   * @returns {HTMLElement} The HTML element representing the dashboard.
   */
  render() {
    this.container.innerHTML = `
      <h2 class="mb-4">HR Dashboard Overview</h2>
      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header">
              <h3>Employee List</h3>
            </div>
            <div class="card-body" id="user-list-container">
              </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header">
              <h3>Salary Overview</h3>
            </div>
            <div class="card-body" id="salary-module-container">
              </div>
          </div>
        </div>
      </div>
    `;

    // Once the basic structure is in place, inject the child components
    this.injectComponents();
    return this.container;
  }

  /**
   * @method injectComponents
   * @description Fetches data and renders the UserList and SalaryModule components into their respective containers.
   */
  async injectComponents() {
    const employees = await apiService.getEmployees();

    // Inject UserList
    const userListElement = new UserList(employees).render();
    renderComponent(this.container.querySelector('#user-list-container'), userListElement);

    // Inject SalaryModule
    const salaryModuleElement = new SalaryModule(employees).render();
    renderComponent(this.container.querySelector('#salary-module-container'), salaryModuleElement);
  }
}