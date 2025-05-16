// src/components/employeeDetails/employeeDetails.js
import { apiService } from "../../services/apiService";
import { FormComponent } from "../form/form";
import { renderComponent } from "../../utils/domInjector";

/**
 * @class EmployeeDetails
 * @description Component responsible for fetching and displaying
 * an individual employee's detailed information using a form.
 */
export class EmployeeDetails {
  /**
   * @param {string} employeeId - The ID of the employee to display.
   */
  constructor(employeeId) {
    this.employeeId = employeeId;
    this.employeeData = null;
    this.container = document.createElement("div");
    this.container.className = "employee-details-container";
    this.formContainer = document.createElement("div"); // Container for the form component
    this.formContainer.id = "employee-form-container";
  }

  /**
   * @method render
   * @description Renders the employee details page. Fetches data and then renders the form.
   * @returns {HTMLElement} The main container element for the employee details.
   */
  async render() {
    this.container.innerHTML = `<h2 class="mb-4">Employee Details</h2>
                              <div id="employee-form-container">
                                  <p>Loading employee data...</p>
                              </div>`; // Initial loading message

    await this.fetchEmployeeData(); // Wait for data to load

    if (this.employeeData) {
      this.renderForm(); // Render form only if data exists
    } else {
      this.container.querySelector(
        "#employee-form-container"
      ).innerHTML = `<div class="alert alert-danger" role="alert">Employee with ID "${this.employeeId}" not found.</div>`;
    }

    return this.container;
  }

  /**
   * @method fetchEmployeeData
   * @description Fetches the employee data from the API service.
   */
  async fetchEmployeeData() {
    console.log("Fetching employee with ID:", this.employeeId);
    try {
      this.employeeData = await apiService.getEmployeeById(this.employeeId);
      console.log("Fetched employee data:", this.employeeData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      this.employeeData = null;
    }
  }

  /**
   * @method renderForm
   * @description Renders the `FormComponent` with the fetched employee data.
   */
  renderForm() {
    const formComponent = new FormComponent(this.employeeData, this.employeeId);
    renderComponent(
      this.container.querySelector("#employee-form-container"),
      formComponent.render()
    );
  }
}
