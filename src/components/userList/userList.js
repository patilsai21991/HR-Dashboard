// src/components/userList/userList.js
import { navigateTo } from '../../router/router';

/**
 * @class UserList
 * @description Displays a list of employees with their basic details.
 * Clicking on an employee navigates to their detailed view.
 */
export class UserList {
  /**
   * @param {Array<Object>} employees - An array of employee objects.
   */
  constructor(employees) {
    this.employees = employees;
    this.container = document.createElement('div');
    this.container.className = 'user-list-container';
  }

  /**
   * @method render
   * @description Renders the HTML table for the employee list.
   * @returns {HTMLElement} The HTML element containing the employee list.
   */
  render() {
    if (!this.employees || this.employees.length === 0) {
      this.container.innerHTML = '<p>No employees to display.</p>';
      return this.container;
    }

    const table = document.createElement('table');
    table.className = 'table table-hover table-striped';
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Department</th>
          <th scope="col">Designation</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        ${this.employees.map(employee => `
          <tr data-employee-id="${employee.id}">
            <td>${employee.name}</td>
            <td>${employee.department}</td>
            <td>${employee.designation}</td>
            <td>
              <button type="button" class="btn btn-sm btn-info view-details-btn" data-employee-id="${employee.id}">View Details</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    this.container.innerHTML = ''; // Clear previous content
    this.container.appendChild(table);

    // Attach event listeners for 'View Details' buttons
    this.container.querySelectorAll('.view-details-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const employeeId = e.target.dataset.employeeId;
        navigateTo(`/employee/${employeeId}`); // Navigate to employee details page
      });
    });

    return this.container;
  }
}