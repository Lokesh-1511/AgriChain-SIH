# AgriChain - Farm to Fork Traceability

A React-based web application for agricultural supply chain traceability, built with Vite.

## Project Structure

```
src/
  main.jsx              # Entry point with React bootstrap
  App.jsx               # Main app with routing setup
  index.css             # Basic reset styles
  pages/                # Page components
    LandingPage.jsx     # Home page
    FarmerRegister.jsx  # Farmer registration
    FarmerLogin.jsx     # Farmer login
    FarmerDashboard.jsx # Farmer dashboard
    ConsumerRegister.jsx # Consumer registration
    ConsumerLogin.jsx   # Consumer login  
    ConsumerDashboard.jsx # Consumer dashboard
    TracePage.jsx       # Product tracing page
  components/           # Reusable components
    Header.jsx          # Navigation header
    Footer.jsx          # Site footer
    LanguageSelector.jsx # Language selection (placeholder)
  styles/               # CSS files
    globals.css         # Global styles and reset
    Header.module.css   # Header component styles
    LandingPage.module.css # Landing page styles
```

## Features

- ✅ React Router for navigation
- ✅ CSS Modules for component styling
- ✅ Responsive design with Flexbox
- ✅ Multi-language support (placeholder)
- ✅ Clean component architecture

## Routes

- `/` - Landing page
- `/farmer/register` - Farmer registration
- `/farmer/login` - Farmer login
- `/farmer/dashboard` - Farmer dashboard
- `/consumer/register` - Consumer registration
- `/consumer/login` - Consumer login
- `/consumer/dashboard` - Consumer dashboard
- `/trace/:productId` - Product trace page

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install additional dependencies for routing and icons:
```bash
npm install react-router-dom react-icons
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build

Create a production build:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## Technology Stack

- **React** - UI library
- **Vite** - Build tool and development server  
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling
- **JavaScript** - No TypeScript

## Next Steps

- Implement authentication logic
- Add form validation
- Connect to backend APIs
- Implement blockchain integration
- Add real language internationalization
- Install and configure react-icons for UI icons

## Contributing

This project was created as part of the Smart India Hackathon (SIH) initiative.

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
