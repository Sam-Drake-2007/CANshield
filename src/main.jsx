import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage.jsx'
import Error404Page from './pages/error/Error404Page.jsx'
import MapPage from './pages/map/MapPage.jsx'
import Results from './pages/results/ResultsPage.jsx'
import Help from './pages/help/HelpPage.jsx'
import favicon from './assets/images/favicon.png'
import ContextProvider from './contexts/ContextProvider.jsx'

const link = document.querySelector("link[rel~='icon']");
if (link) {
    link.href = favicon;}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <Error404Page />
  },
  {
    path: '/map',
    element: <MapPage />
  },
  {
    path: '/results',
    element: <Results />,
  },
  {
    path: '/help',
    element: <Help />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
)
