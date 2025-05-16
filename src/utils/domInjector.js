// src/utils/domInjector.js

/**
 * @function renderComponent
 * @description Injects an HTML element (or string representation of HTML) into a target DOM element.
 * @param {HTMLElement} targetElement - The DOM element where the component will be rendered.
 * @param {HTMLElement|string} componentHtml - The HTML element or HTML string to inject.
 */
export const renderComponent = (targetElement, componentHtml) => {
  if (!targetElement) {
    console.error('Target element not found for rendering component.');
    return;
  }
  // If componentHtml is an HTMLElement, append it directly
  if (componentHtml instanceof HTMLElement) {
    targetElement.innerHTML = ''; // Clear existing content
    targetElement.appendChild(componentHtml);
  } else if (typeof componentHtml === 'string') {
    // If it's a string, set innerHTML (less performant than direct element append for complex components)
    targetElement.innerHTML = componentHtml;
  } else {
    console.error('Invalid componentHtml type. Must be HTMLElement or string.');
  }
};

/**
 * @function clearComponent
 * @description Clears the content of a target DOM element.
 * @param {HTMLElement} targetElement - The DOM element to clear.
 */
export const clearComponent = (targetElement) => {
  if (targetElement) {
    targetElement.innerHTML = '';
  }
};