// src/services/apiService.js

/**
 * @constant {Array<Object>} MOCK_EMPLOYEES
 * @description Static mock data for employees. In a real application, this would come from an API.
 */
const MOCK_EMPLOYEES = [
  { id: '1', name: 'Amit Kumar', department: 'HR', designation: 'Manager', salary: 75000, receivedSalary: true },
  { id: '2', name: 'Naresh Bachala', department: 'Engineering', designation: 'Developer', salary: 60000, receivedSalary: true },
  { id: '3', name: 'Subra Seniuar', department: 'Marketing', designation: 'Specialist', salary: 50000, receivedSalary: false },
  { id: '4', name: 'Sahil Sharma', department: 'HR', designation: 'Recruiter', salary: 55000, receivedSalary: true },
  { id: '5', name: 'Eve Davis', department: 'Sales', designation: 'Sales Rep', salary: 48000, receivedSalary: false },
  { id: '6', name: 'Mohit Gadi', department: 'Engineering', designation: 'Lead', salary: 85000, receivedSalary: true },
  { id: '7', name: 'Simran Mathur', department: 'Finance', designation: 'Accountant', salary: 62000, receivedSalary: true },
];

/**
 * @class ApiService
 * @description Provides methods to simulate API calls for employee data.
 */
class ApiService {
  /**
   * @method getEmployees
   * @description Simulates fetching a list of all employees.
   * @returns {Promise<Array<Object>>} A promise that resolves with the array of employees.
   */
  async getEmployees() {
    // Simulate network delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...MOCK_EMPLOYEES]); // Return a copy to prevent direct mutation
      }, 500);
    });
  }

  /**
   * @method getEmployeeById
   * @description Simulates fetching a single employee by their ID.
   * @param {string} id - The ID of the employee to fetch.
   * @returns {Promise<Object|null>} A promise that resolves with the employee object or null if not found.
   */
  async getEmployeeById(id) {
    return new Promise(resolve => {
      setTimeout(() => {
        const employee = MOCK_EMPLOYEES.find(emp => emp.id === id);
        resolve(employee ? { ...employee } : null); // Return a copy
      }, 300);
    });
  }

  /**
   * @method updateEmployee
   * @description Simulates updating an employee's data. In a real app, this would involve a PUT/PATCH request.
   * @param {string} id - The ID of the employee to update.
   * @param {Object} updatedData - The data to update.
   * @returns {Promise<Object|null>} A promise that resolves with the updated employee or null if not found.
   */
  async updateEmployee(id, updatedData) {
    return new Promise(resolve => {
      setTimeout(() => {
        const index = MOCK_EMPLOYEES.findIndex(emp => emp.id === id);
        if (index !== -1) {
          MOCK_EMPLOYEES[index] = { ...MOCK_EMPLOYEES[index], ...updatedData };
          resolve({ ...MOCK_EMPLOYEES[index] });
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  /**
   * @method addEmployee
   * @description Simulates adding a new employee to the data store.
   * Generates a simple unique ID.
   * @param {Object} newEmployeeData - The data for the new employee (name, department, designation, salary).
   * @returns {Promise<Object>} A promise that resolves with the newly added employee object.
   */
  async addEmployee(newEmployeeData) {
    return new Promise(resolve => {
      setTimeout(() => {
        // Generate a simple unique ID (for mock purposes)
        const newId = (MOCK_EMPLOYEES.length + 1).toString();
        const employee = {
          id: newId,
          ...newEmployeeData,
          receivedSalary: newEmployeeData.receivedSalary || false // Default to false if not provided
        };
        MOCK_EMPLOYEES.push(employee);
        console.log('New employee added:', employee);
        resolve({ ...employee });
      }, 300);
    });
  }
}

export const apiService = new ApiService();