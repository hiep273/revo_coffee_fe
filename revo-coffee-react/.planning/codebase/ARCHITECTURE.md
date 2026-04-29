# Architecture

The application follows a standard Single Page Application (SPA) architecture using React and Vite.

## Patterns
- **Component-Based Architecture**: UI is broken down into reusable components (`src/components/`).
- **Page-Based Routing**: Top-level views are mapped to specific routes (`src/pages/`).
- **Layouts**: Distinct layouts for the public-facing application (`Layout.jsx`) and the admin dashboard (`AdminLayout.jsx`).
- **Global State Management**: Zustand is used for global state management (`src/store/useStore.js`).
- **Internationalization**: `i18n` setup for multi-language support.

## Data Flow
- User interactions trigger state changes in Zustand or local component state.
- React Router manages navigation without full page reloads.
- Data is currently fetched/imported from static files (`src/data/products.js`).
