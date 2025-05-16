// src/router/router.js
import { renderComponent, clearComponent } from '../utils/domInjector';
import { Dashboard } from '../layouts/dashboard/dashboard';
import { EmployeeDetails } from '../components/employeeDetails/employeeDetails';

/**
 * @private
 * @type {HTMLElement|null}
 * @description The main content container where views will be rendered.
 */
let mainContentContainer = null;

/**
 * @private
 * @type {Object.<string, Function>}
 * @description Defines the routes for the application. Each key is a path, and the value is a function
 * that returns the component to be rendered for that path.
 */
const routes = {
  '/': () => new Dashboard().render(), // Dashboard is the default view
  '/dashboard': () => new Dashboard().render(),
  '/employee/:id': (params) => new EmployeeDetails(params.id).render(), // Employee details page
};

/**
 * @function initRouter
 * @description Initializes the router by setting the main content container and attaching
 * event listeners for navigation.
 * @param {HTMLElement} container - The DOM element where the main content will be rendered.
 */
export const initRouter = (container) => {
  mainContentContainer = container;
  window.addEventListener('popstate', router); // Handle browser back/forward buttons
  document.body.addEventListener('click', (e) => {
    // Intercept clicks on anchor tags to use SPA navigation
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
};

/**
 * @function navigateTo
 * @description Navigates to a new URL within the SPA, updates the browser history, and renders the new view.
 * @param {string} url - The URL to navigate to.
 */
export const navigateTo = (url) => {
  history.pushState(null, null, url); // Update URL without full page reload
  router(); // Render the new view
};

/**
 * @function router
 * @description Core routing logic. Parses the current URL, matches it against defined routes,
 * and renders the corresponding component.
 */
const router = async () => {
  if (!mainContentContainer) {
    console.error('Router not initialized. Call initRouter() first.');
    return;
  }

  const path = window.location.pathname;
  let match = null;
  let params = {};

  // Find a matching route
  for (const routePath in routes) {
    const routeParts = routePath.split('/').filter(Boolean); // Remove empty strings
    const pathParts = path.split('/').filter(Boolean);

    if (routeParts.length !== pathParts.length && !routePath.includes(':')) {
      continue; // Skip if lengths don't match and no dynamic parts
    }

    let currentMatch = true;
    let currentParams = {};

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        // Dynamic part
        currentParams[routeParts[i].substring(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        currentMatch = false;
        break;
      }
    }

    if (currentMatch) {
      match = routes[routePath];
      params = currentParams;
      break;
    }
  }

  // Handle 404 (Not Found) if no route matches
  if (!match) {
    console.warn('404 Not Found:', path);
    mainContentContainer.innerHTML = `<div class="alert alert-warning" role="alert">Page not found: <code>${path}</code></div>`;
    return;
  }

  clearComponent(mainContentContainer); // Clear previous content

  // *** IMPORTANT CHANGE HERE ***
  // Await the result of the component's render method,
  // as it returns a Promise because Dashboard/EmployeeDetails.render() are async.
  const componentToRender = await match(params); // <--- ADD AWAIT HERE

  renderComponent(mainContentContainer, componentToRender); // Now componentToRender will be an HTMLElement
};