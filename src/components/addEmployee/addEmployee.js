// src/components/addEmployee/addEmployee.js
import { FormComponent } from '../form/form';
import { renderComponent } from '../../utils/domInjector';

/**
 * @class AddEmployee
 * @description Component responsible for displaying the form to add a new employee.
 * It leverages the reusable FormComponent.
 */
export class AddEmployee {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'add-employee-container';
    this.formContainer = document.createElement('div');
    this.formContainer.id = 'add-employee-form-container';
  }

  /**
   * @method render
   * @description Renders the Add Employee page with the FormComponent.
   * @returns {HTMLElement} The main container element for adding an employee.
   */
  async render() { // Keep render async for consistency, even if no direct awaits here now
    this.container.innerHTML = `
      <h2 class="mb-4">Add New Employee</h2>
      <div id="add-employee-form-container">
        </div>
    `;

    this.renderForm();
    return this.container;
  }

  /**
   * @method renderForm
   * @description Renders the `FormComponent` without initial employee data,
   * indicating it's for adding a new employee.
   */
  renderForm() {
    // Pass null or an empty object for employeeData to indicate "add" mode
    const formComponent = new FormComponent(null, null); // No employeeData, no employeeId
    renderComponent(this.container.querySelector('#add-employee-form-container'), formComponent.render());
  }
}