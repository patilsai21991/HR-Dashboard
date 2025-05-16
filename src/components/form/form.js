// src/components/form/form.js
import { validationService } from '../../services/validationService';
import { apiService } from '../../services/apiService';
import { SalaryModule } from '../salaryModule/salaryModule';
import { renderComponent, clearComponent } from '../../utils/domInjector';
import { navigateTo } from '../../router/router';

/**
 * @class FormComponent
 * @description A reusable form component for displaying and editing employee details.
 * It includes validation, submission handling, and a dynamic salary view button.
 */
export class FormComponent {
  /**
   * @param {Object} employeeData - The initial data to populate the form fields.
   * @param {string} employeeId - The ID of the employee being edited.
   */
  constructor(employeeData, employeeId) {
    this.employeeData = employeeData || {};
    this.employeeId = employeeId;
    this.container = document.createElement('form');
    this.container.className = 'employee-form needs-validation'; // Bootstrap validation class
    this.isSalaryViewVisible = false; // State for salary chart/module visibility
    this.isSalaryFieldVisible = false; // New state for salary input field visibility
    this.salaryPopupContainer = null; // To hold the salary module instance
  }

  /**
   * @method render
   * @description Renders the HTML structure of the employee form.
   * @returns {HTMLElement} The form element.
   */
  render() {
    this.container.setAttribute('novalidate', ''); // Disable browser's default validation

    // Determine initial display style for the salary input group
    const salaryInputDisplayStyle = this.isSalaryFieldVisible ? 'block' : 'none';

    this.container.innerHTML = `
      <div class="mb-3">
        <label for="employeeName" class="form-label">Name</label>
        <input type="text" class="form-control" id="employeeName" value="${this.employeeData.name || ''}" required>
        <div class="invalid-feedback" id="nameFeedback"></div>
      </div>
      <div class="mb-3">
        <label for="employeeDepartment" class="form-label">Department</label>
        <input type="text" class="form-control" id="employeeDepartment" value="${this.employeeData.department || ''}" required>
        <div class="invalid-feedback" id="departmentFeedback"></div>
      </div>
      <div class="mb-3">
        <label for="employeeDesignation" class="form-label">Designation</label>
        <input type="text" class="form-control" id="employeeDesignation" value="${this.employeeData.designation || ''}" required>
        <div class="invalid-feedback" id="designationFeedback"></div>
      </div>

      <div class="mb-3" id="salary-input-group" style="display: ${salaryInputDisplayStyle};">
        <label for="employeeSalary" class="form-label">Salary</label>
        <input type="number" class="form-control" id="employeeSalary" value="${this.employeeData.salary || ''}" required min="0">
        <div class="invalid-feedback" id="salaryFeedback"></div>
      </div>

      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="receivedSalary" ${this.employeeData.receivedSalary ? 'checked' : ''}>
        <label class="form-check-label" for="receivedSalary">Salary Received</label>
      </div>

      <div class="d-flex justify-content-between align-items-center">
        <div>
          <button type="submit" class="btn btn-primary me-2" id="submitBtn">Save Details</button>
          <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
        </div>
        <div>
          <button type="button" class="btn btn-info" id="viewSalaryBtn">
            ${this.isSalaryFieldVisible ? 'Hide Salary Field' : 'Show Salary Field'}
          </button>
        </div>
      </div>

      <div id="salary-popup-container" class="mt-4 border p-3 rounded" style="display:${this.isSalaryViewVisible ? 'block' : 'none'};">
        <h5>Individual Salary Overview</h5>
        </div>
    `;

    this.addEventListeners();
    this.salaryPopupContainer = this.container.querySelector('#salary-popup-container');

    // If salary chart view was previously visible, render it again after re-rendering the form
    if (this.isSalaryViewVisible) {
        this.renderSalaryModule();
    }

    return this.container;
  }

  /**
   * @method addEventListeners
   * @description Attaches event listeners to the form elements for submission, cancellation,
   * input changes, and salary view toggle.
   */
  addEventListeners() {
    this.container.addEventListener('submit', this.handleSubmit.bind(this));
    this.container.querySelector('#cancelBtn').addEventListener('click', this.handleCancel.bind(this));
    this.container.querySelector('#viewSalaryBtn').addEventListener('click', this.toggleSalaryView.bind(this));

    // Add input event listeners for real-time validation feedback
    // Only add for visible fields initially, or handle visibility dynamically
    // For now, we'll keep it simple and ensure validation runs on all fields during submit
    ['employeeName', 'employeeDepartment', 'employeeDesignation', 'employeeSalary'].forEach(id => {
        const input = this.container.querySelector(`#${id}`);
        if (input) {
            input.addEventListener('input', () => this.validateField(input));
        }
    });
  }

  /**
   * @method handleSubmit
   * @description Handles the form submission, performs validation, and updates employee data.
   * @param {Event} event - The submit event.
   */
  async handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = this.getFormData();
    const errors = validationService.validateEmployeeForm(formData);

    this.clearValidationFeedback(); // Clear previous feedback
    this.showValidationFeedback(errors); // Show new feedback

    if (Object.keys(errors).length > 0) {
      alert('Please correct the highlighted errors before submitting.');
      return;
    }

    try {
      const updatedEmployee = await apiService.updateEmployee(this.employeeId, formData);
      if (updatedEmployee) {
        alert('Employee details updated successfully!');
        // Optionally, re-render the dashboard or navigate back
        navigateTo('/dashboard');
      } else {
        alert('Failed to update employee details.');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('An error occurred while saving employee details.');
    }
  }

  /**
   * @method handleCancel
   * @description Handles the form cancellation, prompting the user and navigating back to the dashboard.
   */
  handleCancel() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigateTo('/dashboard');
    }
  }

  /**
   * @method toggleSalaryView
   * @description Toggles the visibility of the salary input field and the salary view (popup/chart).
   */
  toggleSalaryView() {
    // Toggle the visibility state for both the input field and the chart module
    this.isSalaryFieldVisible = !this.isSalaryFieldVisible;
    this.isSalaryViewVisible = !this.isSalaryViewVisible; // Keep this for the chart part

    const salaryInputGroup = this.container.querySelector('#salary-input-group');
    const viewSalaryBtn = this.container.querySelector('#viewSalaryBtn');

    // Update salary input field visibility
    if (salaryInputGroup) {
      salaryInputGroup.style.display = this.isSalaryFieldVisible ? 'block' : 'none';
    }

    // Update salary chart container visibility
    if (this.salaryPopupContainer) {
      this.salaryPopupContainer.style.display = this.isSalaryViewVisible ? 'block' : 'none';
    }

    // Update button text
    viewSalaryBtn.textContent = this.isSalaryFieldVisible ? 'Hide Salary Field & Chart' : 'Show Salary Field & Chart';

    // Conditionally render/clear the salary module chart
    if (this.isSalaryViewVisible) {
      this.renderSalaryModule();
    } else {
      clearComponent(this.salaryPopupContainer); // Clear content when hiding
    }
  }


  /**
   * @method renderSalaryModule
   * @description Renders the SalaryModule component inside the salary view container.
   */
  renderSalaryModule() {
    // For individual employee, the SalaryModule will show only their own status.
    // We create a temporary array for this single employee.
    const individualEmployeeArray = [
        {
            id: this.employeeData.id,
            name: this.employeeData.name,
            // Get current status from the form checkbox, as it might have been changed
            receivedSalary: this.container.querySelector('#receivedSalary').checked
        }
    ];
    const salaryModule = new SalaryModule(individualEmployeeArray);
    const targetDiv = this.container.querySelector('#salary-popup-container');
    renderComponent(targetDiv, salaryModule.render());
  }

  /**
   * @method getFormData
   * @description Extracts current values from the form inputs.
   * @returns {Object} An object containing the current form data.
   */
  getFormData() {
    // Ensure that if the salary field is hidden, its value is still retrieved
    // or set to a default/null if it's not meant to be submitted.
    // For now, we'll retrieve it if it exists in the DOM.
    const salaryInput = this.container.querySelector('#employeeSalary');
    return {
      name: this.container.querySelector('#employeeName').value,
      department: this.container.querySelector('#employeeDepartment').value,
      designation: this.container.querySelector('#employeeDesignation').value,
      // Safely get salary value. If input is hidden, it might not have a value
      // or might be empty. Use `|| 0` for numbers.
      salary: salaryInput ? parseFloat(salaryInput.value) || 0 : 0,
      receivedSalary: this.container.querySelector('#receivedSalary').checked,
    };
  }

  /**
   * @method validateField
   * @description Validates a single form field and updates its visual feedback.
   * @param {HTMLInputElement} inputElement - The input element to validate.
   */
  validateField(inputElement) {
    const fieldName = inputElement.id.replace('employee', '').toLowerCase();
    const feedbackElement = this.container.querySelector(`#${fieldName}Feedback`);
    const value = inputElement.value;
    let isValid = true;
    let errorMessage = '';

    // Only validate if the field is visible, or if it's a field that's always logically required
    // For salary, we only validate it if it's visible AND required by the business logic.
    // Given it's marked 'required' in HTML, it will be validated if visible.
    // If it's hidden, we might need a separate check during form submission
    // to determine if it's "required" based on business rules.
    // For simplicity, current validation `validateRequired` checks if value exists.
    // If field is hidden and empty, it will fail `validateRequired`.

    if (fieldName === 'salary' && !this.isSalaryFieldVisible) {
        // If salary field is hidden, we might not want to validate it unless explicitly needed for submission
        // For this scenario, we assume if it's hidden, it's not being actively edited/validated.
        // The submit button's validation will catch it if it's required during submission.
        return;
    }


    if (!validationService.validateRequired(value)) {
      isValid = false;
      errorMessage = `${inputElement.previousElementSibling.textContent.replace(':', '')} is required.`;
    } else if (fieldName === 'salary') {
      if (!validationService.validateNumber(value)) {
        isValid = false;
        errorMessage = 'Salary must be a valid number.';
      } else if (parseFloat(value) <= 0) {
          isValid = false;
          errorMessage = 'Salary must be greater than zero.';
      }
    }
    // Add other specific validations here if needed (e.g., minLength for name, etc.)

    if (isValid) {
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
      if (feedbackElement) feedbackElement.textContent = '';
    } else {
      inputElement.classList.add('is-invalid');
      inputElement.classList.remove('is-valid');
      if (feedbackElement) feedbackElement.textContent = errorMessage;
    }
  }


  /**
   * @method clearValidationFeedback
   * @description Clears all validation feedback messages and classes from the form.
   */
  clearValidationFeedback() {
    this.container.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    this.container.querySelectorAll('.invalid-feedback').forEach(el => {
      el.textContent = '';
    });
  }

  /**
   * @method showValidationFeedback
   * @description Displays validation error messages for the given errors object.
   * @param {Object} errors - An object where keys are field names and values are error messages.
   */
  showValidationFeedback(errors) {
    for (const field in errors) {
      // Only show validation for visible fields, or fields that are always considered
      // part of the core form. If salary is hidden, we might choose not to highlight its error.
      // However, for submission, it's still crucial to validate it.
      const inputElement = this.container.querySelector(`#employee${field.charAt(0).toUpperCase() + field.slice(1)}`);
      const feedbackElement = this.container.querySelector(`#${field}Feedback`);

      if (inputElement) {
        // If the field is salary and it's currently hidden, we might not want to visually mark it invalid
        // immediately, but the error will still be in the `errors` object.
        // For simplicity, we'll mark it invalid regardless of visibility on submit.
        inputElement.classList.add('is-invalid');
      }
      if (feedbackElement) {
        feedbackElement.textContent = errors[field];
      }
    }
  }
}