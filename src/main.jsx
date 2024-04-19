import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import '@radix-ui/themes/styles.css';
import "./index.css"
import { ThemeProvider } from './components/context/ThemeContext.tsx'
import { Theme as RadixTheme } from '@radix-ui/themes';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThemeProvider>
      <RadixTheme>
        <App />
      </RadixTheme>
    </ThemeProvider>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
