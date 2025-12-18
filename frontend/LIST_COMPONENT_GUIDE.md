#!/usr/bin/env node
/**
 * LIST COMPONENT IMPLEMENTATION GUIDE
 * 
 * This document explains how to use the generic list component
 * that has been implemented for the localCompass application.
 */

/**
 * BASIC USAGE
 * 
 * The list component provides a flexible way to display data
 * with built-in support for loading, error, and empty states.
 */

import { createGenericList } from "../../components/list/list.js";

// 1. Create a container element in your view
const container = document.getElementById('container');
const listMount = document.createElement('div');
listMount.id = 'my-list';
container.appendChild(listMount);

// 2. Create the list component with options
const listComponent = createGenericList('my-list', {
  // renderItem is required - it determines how each item is displayed
  renderItem: (item) => {
    const li = document.createElement('li');
    li.className = 'lc-card'; // Use the card styling
    
    // Build the card content
    li.innerHTML = `
      <div class="lc-card-header">
        <div class="lc-avatar">${item.initial}</div>
        <div>
          <div class="lc-card-title">${item.title}</div>
          <div style="font-size: 12px; color: #64748b;">
            ${item.subtitle}
          </div>
        </div>
      </div>
      <div class="lc-card-body">
        ${item.description}
      </div>
    `;
    
    return li;
  }
});

// 3. Load data by calling updateData with a promise
listComponent.updateData(
  fetch('/api/items').then(res => res.json())
);

/**
 * FEATURES
 * 
 * ✓ Loading State - Shows spinner while data is being fetched
 * ✓ Error State - Displays error message if fetch fails
 * ✓ Empty State - Shows "No results found" when data is empty
 * ✓ Responsive Grid - Automatically adapts to screen size
 *   - Desktop: 4 columns
 *   - Tablet: 2 columns
 *   - Mobile: 1 column
 * ✓ Card Styling - Built-in CSS classes for consistent appearance
 * ✓ Hover Effects - Cards lift on hover for better UX
 */

/**
 * CSS CLASSES AVAILABLE
 * 
 * .lc-card              - Main card container
 * .lc-card-header       - Card header section
 * .lc-card-body         - Card body section
 * .lc-card-title        - Card title text
 * .lc-avatar            - Avatar circle
 * .lc-list-group        - The grid container
 * .lc-list-wrapper      - List wrapper
 * .lc-list-body         - List body
 * .lc-list-centered     - Centered container for loading/empty
 * .lc-button--primary   - Primary button style
 * 
 * Utility Classes:
 * .text-center          - Center text
 * .text-muted           - Muted text color
 * .p-3, .p-4, .p-5      - Padding
 * .m-3                  - Margin
 * .d-flex               - Display flex
 * .align-items-center   - Align flex items
 */

/**
 * EXAMPLE: NEIGHBORS LIST (Like in testView)
 */

const neighborsListComponent = createGenericList('neighbors-mount', {
  renderItem: (user) => {
    const item = document.createElement('li');
    item.className = 'lc-card';

    item.innerHTML = `
      <div class="lc-card-header">
        <div class="lc-avatar">${user.firstName?.charAt(0).toUpperCase() || 'U'}</div>
        <div>
          <div class="lc-card-title">${user.firstName || 'New'} ${user.lastName || 'Neighbor'}</div>
          <div style="font-size: 12px; color: #64748b;">
            <i class="bi bi-patch-check"></i> Verified Resident
          </div>
        </div>
      </div>
      <div class="lc-card-body" style="flex-grow: 1; margin-bottom: 16px;">
        Apartment ${user.apartment}
      </div>
    `;

    const connectBtn = createButton({
      label: 'Send Message',
      className: 'lc-button--primary',
      onClick: () => handleConnect(user)
    });

    item.appendChild(connectBtn);
    return item;
  }
});

// Load data
neighborsListComponent.updateData(
  userService.getNeighbors()
);

/**
 * EXAMPLE: SIMPLE LIST
 */

const simpleListComponent = createGenericList('items-mount', {
  renderItem: (item) => {
    const li = document.createElement('li');
    li.className = 'list-group-item'; // Use default styling
    li.textContent = item.name;
    return li;
  }
});

// Load data
simpleListComponent.updateData(
  fetch('/api/items').then(res => res.json())
);

/**
 * API REFERENCE
 * 
 * createGenericList(containerId, options)
 * 
 * Parameters:
 *   containerId (string) - The ID of the container element to mount the list
 *   options (object) - Configuration options
 *     - renderItem (function) - Function that takes an item and returns a DOM element
 *                              Optional: defaults to plain text rendering
 * 
 * Returns:
 *   Object with methods:
 *     - updateData(fetchPromise) - Load data asynchronously
 *                                  Accepts a promise that resolves to an array
 *                                  Automatically handles loading, error, and render states
 */

/**
 * ERROR HANDLING
 * 
 * The component automatically displays error messages when:
 * - The fetch promise is rejected
 * - An error occurs during data processing
 * 
 * The error message is displayed in a red alert box.
 */

/**
 * RESPONSIVE DESIGN
 * 
 * The grid is responsive by default:
 * 
 * Desktop (> 1200px): 4 columns
 * Tablet (600px - 1200px): 2 columns
 * Mobile (< 600px): 1 column
 * 
 * Gap between cards: 20px
 * Max width: 1400px
 * Padding: 15px horizontal
 */

export {};
