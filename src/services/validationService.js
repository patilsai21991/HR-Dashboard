// src/services/validationService.js

/**
 * @class ValidationService
 * @description Provides various validation methods for form inputs.
 */
class ValidationService {
  /**
   * @method validateRequired
   * @description Checks if a field is not empty or just whitespace.
   * @param {string} value - The value to validate.
   * @returns {boolean} True if the value is not empty, false otherwise.
   */
  validateRequired(value) {
    return value && value.trim() !== '';
  }

  /**
   * @method validateEmail
   * @description Checks if a string is a valid email format.
   * @param {string} email - The email string to validate.
   * @returns {boolean} True if the email is valid, false otherwise.
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * @method validateNumber
   * @description Checks if a string represents a valid number.
   * @param {string} value - The value to validate.
   * @returns {boolean} True if the value is a number, false otherwise.
   */
  validateNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  /**
   * @method validateMinLength
   * @description Checks if a string meets a minimum length requirement.
   * @param {string} value - The string to validate.
   * @param {number} minLength - The minimum required length.
   * @returns {boolean} True if the length is sufficient, false otherwise.
   */
  validateMinLength(value, minLength) {
    return value.length >= minLength;
  }

  /**
   * @method validateEmployeeForm
   * @description Validates the entire employee form data.
   * @param {Object} formData - The form data object with fields like name, department, designation, salary.
   * @returns {Object} An object where keys are field names and values are error messages, or an empty object if valid.
   */
  validateEmployeeForm(formData) {
    const errors = {};

    if (!this.validateRequired(formData.name)) {
      errors.name = 'Employee name is required.';
    }

    if (!this.validateRequired(formData.department)) {
      errors.department = 'Department is required.';
    }

    if (!this.validateRequired(formData.designation)) {
      errors.designation = 'Designation is required.';
    }

    // Only validate salary if it's provided and not empty
    if (formData.salary !== undefined && formData.salary !== null && String(formData.salary).trim() !== '') {
        if (!this.validateNumber(formData.salary)) {
            errors.salary = 'Salary must be a valid number.';
        } else if (parseFloat(formData.salary) <= 0) {
            errors.salary = 'Salary must be greater than zero.';
        }
    } else {
        errors.salary = 'Salary is required.'; // Consider salary required for new employee
    }


    return errors;
  }
}

export const validationService = new ValidationService();