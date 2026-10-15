import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import MainLayout from './Layouts/MainLayout';
import Home from './Components/Home/Home';
import Explore from './Pages/Explore';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './Components/Shared/ProtectedRoute';
import DoctorDetails from './Pages/DoctorDetails';
import PaymentSuccess from './Pages/PaymentSuccess';
import HowItWorks from './Pages/HowItWorks';
import { AuthProvider } from './Contexts/AuthContext';
import { NotificationProvider } from './Contexts/NotificationContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/explore",
        element: <Explore />
      },
      {
        path: "/doctors",
        element: <Explore />
      },
      {
        path: "/how-it-works",
        element: <HowItWorks />
      },
      {
        path: "/doctor/:id",
        element: <DoctorDetails />
      },
      {
        path: "/doctors/:id",
        element: <DoctorDetails />
      },
      {
        path: "/campaign/:id",
        element: <DoctorDetails />
      },
      {
        path: "/payment/success/:tranId",
        element: <PaymentSuccess />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
);
