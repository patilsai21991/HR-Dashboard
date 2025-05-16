// src/components/menu/menu.js
import { navigateTo } from '../../router/router';

/**
 * @class Menu
 * @description Represents the global navigation menu component.
 * It provides links to different sections of the HR Dashboard.
 */
export class Menu {
  constructor() {
    // No specific state managed by this component for simplicity,
    // as navigation is handled by the global router.
  }

  /**
   * @method render
   * @description Renders the HTML structure of the navigation menu.
   * @returns {HTMLElement} The HTML element representing the menu.
   */
  render() {
    const navElement = document.createElement('nav');
    navElement.className = 'navbar navbar-expand-lg navbar-dark bg-dark';
    navElement.innerHTML = `
      <div class="container-fluid">
        <a class="navbar-brand" href="/" data-link>HR Dashboard</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/dashboard" data-link>Dashboard</a>
            </li>
            </ul>
        </div>
      </div>
    `;

    // Attach event listener for internal navigation (SPA behavior)
    // This listener is already in the router, but adding data-link to elements
    // makes it clear which links are handled by the SPA router.
    // The router's global click listener on `document.body` handles `[data-link]`
    // so no explicit listener is needed here for each menu item.

    return navElement;
  }
}