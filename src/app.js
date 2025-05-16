// src/app.js
import { renderComponent } from './utils/domInjector';
import { navigateTo } from './router/router';
import { initRouter } from './router/router';
import { Menu } from './components/menu/menu'; // Import the Menu component

/**
 * @class App
 * @description Main application class to initialize and manage the SPA.
 */
class App {
  constructor() {
    this.menuContainer = document.getElementById('menu-container');
    this.mainContentContainer = document.getElementById('main-content');
  }

  /**
   * @method init
   * @description Initializes the application by rendering the menu and setting up routing.
   */
  async init() {
    console.log('HR Dashboard App Initializing...');

    // Render the global navigation menu
    this.renderMenu();

    // Initialize the router, passing the main content container for rendering views
    initRouter(this.mainContentContainer);

    // Initial navigation based on the current URL
    navigateTo(window.location.pathname);

    console.log('HR Dashboard App Initialized.');
  }

  /**
   * @method renderMenu
   * @description Renders the main navigation menu into the menu container.
   * The menu component is responsible for its own DOM structure and event listeners.
   */
  renderMenu() {
    const menuComponent = new Menu();
    renderComponent(this.menuContainer, menuComponent.render());
  }
}

export default App;