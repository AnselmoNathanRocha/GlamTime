import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useAuth } from "./contexts/auth";
import { useNetworkStatus } from "./hooks/use-network-status";
import { useNotifications } from "./hooks/use-notifications";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";

const authRoutes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const appRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

export function Routes() {
  useNotifications();
  useNetworkStatus();

  const { logged } = useAuth();
  if (logged === undefined) return null;

  return <RouterProvider router={logged ? appRoutes : authRoutes} />;
}