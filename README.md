# Product Management Frontend

This is the frontend for the Product Management Application, built with React.js and Ant Design. It allows end users to browse products, add them to a cart, and place orders. Admin users can log in to manage products and orders.

## Features

- Browse products with filtering and sorting
- View product details
- Add products to cart and checkout
- View order status and history
- Admin login and dashboard
- Product CRUD (Create, Read, Update, Delete) for admins
- Order management for admins

## Tech Stack

- React.js with TypeScript
- Vite.js for fast development and build
- Ant Design UI library
- React Router for navigation
- Axios for API requests
- Context API for state management

## Project Structure

```
src/
  ├── components/    # Reusable UI components
  ├── contexts/      # React contexts
  ├── pages/         # Page components
  ├── services/      # API service functions
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
public/              # Static assets
```

## Setup and Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Frontend Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the frontend directory with the following variable:

   ```
   REACT_APP_BASE_URL=http://localhost:3001
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

## Deployment

1. Build the frontend:
   ```bash
   npm run build
   ```
2. The build artifacts will be in the `dist` directory, which can be served by any static file server.

## License

This project is licensed under the MIT License.
