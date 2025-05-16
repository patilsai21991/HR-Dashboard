// src/components/salaryModule/salaryModule.js
import { initPieChart } from '../../utils/chartHelper';

/**
 * @class SalaryModule
 * @description A shareable component that displays a pie chart
 * showing the percentage of employees who have received their salary
 * versus those who have not.
 */
export class SalaryModule {
  /**
   * @param {Array<Object>} employees - An array of employee objects, each with a `receivedSalary` boolean.
   */
  constructor(employees) {
    this.employees = employees;
    this.container = document.createElement('div');
    this.container.className = 'salary-module-container';
    this.chartElement = document.createElement('div');
    this.chartElement.className = 'chart-container'; // Apply CSS for chart dimensions
    this.chartElement.id = 'salary-pie-chart';
  }

  /**
   * @method render
   * @description Renders the salary module, including the pie chart.
   * @returns {HTMLElement} The HTML element containing the salary overview.
   */
  render() {
    this.container.innerHTML = `
      <p>This chart shows the distribution of salary reception status among employees.</p>
      <div id="salary-pie-chart" class="chart-container"></div>
    `;

    // Ensure the chart element is in the DOM before initializing ECharts
    // using requestAnimationFrame to wait for the DOM to be fully updated.
    requestAnimationFrame(() => {
        this.initializeChart();
    });


    return this.container;
  }

  /**
   * @method initializeChart
   * @description Calculates data for the pie chart and initializes it using ECharts.
   * This method is called after the component's DOM is rendered.
   */
  initializeChart() {
    if (!this.employees || this.employees.length === 0) {
      this.chartElement.innerHTML = '<p>No salary data available.</p>';
      return;
    }

    const receivedCount = this.employees.filter(emp => emp.receivedSalary).length;
    const notReceivedCount = this.employees.length - receivedCount;

    const chartData = [
      { value: receivedCount, name: 'Salary Received' },
      { value: notReceivedCount, name: 'Salary Not Received' }
    ];

    // Get the element where the chart should be rendered
    const chartDom = this.container.querySelector('#salary-pie-chart');

    // Initialize the pie chart using the helper function
    initPieChart(chartDom, 'Employee Salary Status', chartData);
  }
}