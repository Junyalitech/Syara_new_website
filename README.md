# Syara

A modern e-commerce storefront built with React, Vite, Tailwind CSS, and Redux Toolkit. Syara includes product browsing, category filtering, cart management, protected checkout, account settings, and policy pages.

## Features

- Product listing by category
- Product detail pages with image galleries
- Cart context with add/remove item logic
- Auth-protected checkout and account pages
- Redux Toolkit slices for auth, cart, orders, payments, and product data
- React Query support for API data fetching
- Tailwind CSS and Radix UI components for responsive UI
- Contact, privacy, returns, and terms pages
- Toast notifications and custom tooltips

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Redux Toolkit
- React Query
- React Router DOM
- Radix UI
- Axios
- Zod
- React Hot Toast

## Getting Started

### Requirements

- Node.js 18+ (or compatible LTS)
- npm

### Install dependencies

```bash
npm install
```

### Environment

Syara expects a backend API base URL in an environment variable.

Create a `.env` file in the project root with:

```env
VITE_API_URL=https://your-api.example.com
```

### Run locally

```bash
npm run dev
```

Open the local URL shown in the terminal to view the app.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

- `src/` - main source files
- `src/App.jsx` - application routes and layout
- `src/main.jsx` - app entry point
- `src/app/store.js` - Redux store configuration
- `src/context/CartContext.jsx` - cart state provider
- `src/components/` - reusable UI components
- `src/features/` - Redux feature slices and async logic
- `src/Pages/` - page-level views
- `src/components/Policy/` - privacy, returns, and terms pages

## Notes

- The app uses `import.meta.env.VITE_API_URL` for API requests.
- Protected routes redirect unauthenticated users to the home page.
- Local storage stores tokens and user identifiers for session persistence.

## Scripts

- `npm run dev` - start development server
- `npm run build` - build production assets
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## License

This repository is currently private and may be adapted for custom e-commerce frontend projects.
