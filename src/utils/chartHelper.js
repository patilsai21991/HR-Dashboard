// src/utils/chartHelper.js
import * as echarts from 'echarts';

/**
 * @function initPieChart
 * @description Initializes and renders a pie chart using Apache ECharts.
 * @param {HTMLElement} domElement - The DOM element to render the chart into.
 * @param {string} titleText - The title of the chart.
 * @param {Array<Object>} seriesData - An array of objects for the pie chart series (e.g., [{value: 100, name: 'Label'}]).
 */
export const initPieChart = (domElement, titleText, seriesData) => {
  if (!domElement) {
    console.error('DOM element not found for chart initialization.');
    return;
  }

  // Initialize the ECharts instance
  const myChart = echarts.init(domElement);

  // Configure the chart options
  const option = {
    title: {
      text: titleText,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)' // Custom tooltip format
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: seriesData.map(item => item.name) // Legend based on series data names
    },
    series: [
      {
        name: titleText,
        type: 'pie',
        radius: ['50%', '70%'], // Donut chart style
        avoidLabelOverlap: false,
        label: {
          show: false, // Hide labels on the slices by default
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData
      }
    ]
  };

  // Set the options and render the chart
  myChart.setOption(option);

  // Add a resize listener to make the chart responsive
  window.addEventListener('resize', () => myChart.resize());

  return myChart; // Return the chart instance for potential future interactions
};