import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/resetpassword',
    element: <ResetPassword />
  },
  {
    path: '/verifyemail',
    element: <VerifyEmail />
  },
  {
    path: '*', // 404 route
    element: <div>Page Not Found</div>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)