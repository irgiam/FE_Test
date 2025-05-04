import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

// import views
import Login from "../views/auth/Login";
import Dashboard from "../views/dashboard";
import LalinOverview from "../views/lalu-lintas/LalinOverview";
import MasterGerbang from "../views/Gerbang/MasterGerbang";

// Protected Route Component
const PrivateRoute = ({ redirectPath = "/login" }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

// Public Route Component (for login page)
const PublicRoute = ({ redirectPath = "/dashboard" }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default function AppRoutes() {
  const { isAuthenticated } = useContext(AuthContext);
  console.log("Auth status:", isAuthenticated);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lalin-perday-report" element={<LalinOverview />} />
        <Route path="/master-gerbang" element={<MasterGerbang />} />
      </Route>

      {/* Catch all route - redirect to login if not authenticated, dashboard if authenticated */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
