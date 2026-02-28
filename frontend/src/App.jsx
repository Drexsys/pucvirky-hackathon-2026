import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header/Header.jsx';
import HomePage from './pages/Home/Home.jsx';
import OrdersPage from './pages/OrderPage/OrderPage.jsx';
import ImportPage from './pages/ImportPage/ImportPage.jsx';
import CreateOrderPage from './pages/CreateOrderPage/CreateOrderPage.jsx';
import CreateAdminPage from './pages/CreateAdminPage/CreateAdminPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import { getUserCount } from './api/auth.js';
import './App.css';

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  const [userCount, setUserCount] = useState(null);
  const [checkingUsers, setCheckingUsers] = useState(true);
  const location = useLocation();

  useEffect(() => {
    getUserCount()
      .then(count => {
        setUserCount(count);
        setCheckingUsers(false);
      })
      .catch(err => {
        console.error('Failed to get user count:', err);
        setCheckingUsers(false);
      });
  }, [location.pathname]); // Re-check when location changes

  const RequireAuth = ({ children }) => {
    const location = useLocation();
    if (loading || checkingUsers) {
      return <div className="app-loading">Loading...</div>;
    }
    if (!isAuthenticated) {
      // If no users exist, redirect to create-admin page
      if (userCount === 0) {
        return <Navigate to="/create-admin" state={{ from: location }} replace />;
      }
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  const LoginRedirect = ({ children }) => {
    const location = useLocation();
    if (loading || checkingUsers) {
      return <div className="app-loading">Loading...</div>;
    }
    // If no users exist, redirect to create-admin page
    if (userCount === 0) {
      return <Navigate to="/create-admin" replace />;
    }
    if (isAuthenticated) {
      const target = location.state?.from?.pathname || '/orders';
      return <Navigate to={target} replace />;
    }
    return children;
  };

  const CreateAdminAccess = ({ children }) => {
    const location = useLocation();
    if (loading || checkingUsers) {
      return <div className="app-loading">Loading...</div>;
    }
    // Allow access to create-admin if no users exist OR if authenticated
    if (userCount === 0 || isAuthenticated) {
      return children;
    }
    // If users exist but not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  };

  return (
      <div className="app-layout">
        <Header />
        <div className="app-body">
          <main className="app-main">
            <Routes>
              <Route path="/"        element={<HomePage />}                             />
              <Route path="/orders"  element={<RequireAuth><OrdersPage /></RequireAuth>}      />
              <Route path="/import"  element={<RequireAuth><ImportPage /></RequireAuth>}      />
              <Route path="/create"  element={<RequireAuth><CreateOrderPage /></RequireAuth>} />
              <Route path="/create-admin"  element={<CreateAdminAccess><CreateAdminPage /></CreateAdminAccess>} />
              <Route path="/login"   element={<LoginRedirect><LoginPage /></LoginRedirect>}   />
            </Routes>
          </main>
        </div>
      </div>
  );
}