import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/landing/LandingPage.jsx'
import Error404Page from './pages/Error404Page.jsx'
import Map from './pages/map/MapPage.jsx'
import Results from './pages/results/ResultsPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <Error404Page />
  },
  {
    path: '/map',
    element: <Map />
  },
  {
    path: '/results',
    element: <Results />,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
