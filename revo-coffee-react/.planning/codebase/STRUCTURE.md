# Directory Structure

- `.planning/`: Project planning and mapping documents.
- `src/`: Main source code directory.
  - `assets/`: Static assets like images and fonts.
  - `components/`: Reusable UI components (e.g., `Header.jsx`, `Footer.jsx`, `Products.jsx`).
  - `data/`: Mock or static data files (e.g., `products.js`).
  - `features/`: Currently empty. Likely intended for feature-based modules.
  - `layouts/`: Application layout wrappers (`AdminLayout.jsx`, `Layout.jsx`).
  - `locales/`: Translation files for i18next (`en/`, `vi/`).
  - `pages/`: Route components.
    - `/`: Public pages (`Home.jsx`, `Shop.jsx`, `Cart.jsx`, `Checkout.jsx`, `Login.jsx`, etc.)
    - `admin/`: Admin dashboard pages (`Dashboard.jsx`, `Inventory.jsx`, `Orders.jsx`, `Products.jsx`, `Batches.jsx`).
  - `store/`: Zustand state management (`useStore.js`).
  - `App.jsx` & `main.jsx`: Application entry points.
  - `i18n.js`: Internationalization configuration.
  - `index.css`: Global CSS and Tailwind directives.
