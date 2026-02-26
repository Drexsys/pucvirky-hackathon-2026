import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header/Header.jsx';
import HomePage from './pages/Home/Home.jsx';
import OrdersPage from './pages/OrderPage/OrderPage.jsx';
import ImportPage from './pages/ImportPage/ImportPage.jsx';
import CreateOrderPage from './pages/CreateOrderPage/CreateOrderPage.jsx';
import CreateAdminPage from './pages/CreateAdminPage/CreateAdminPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';
import './App.css';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  const RequireAuth = ({ children }) => {
    const location = useLocation();
    if (loading) {
      return <div className="app-loading">Loading...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
  };

  const LoginRedirect = ({ children }) => {
    const location = useLocation();
    if (loading) {
      return <div className="app-loading">Loading...</div>;
    }
    if (isAuthenticated) {
      const target = location.state?.from?.pathname || '/orders';
      return <Navigate to={target} replace />;
    }
    return children;
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
              <Route path="/create-admin"  element={<RequireAuth><CreateAdminPage /></RequireAuth>} />
              <Route path="/login"   element={<LoginRedirect><LoginPage /></LoginRedirect>}   />
            </Routes>
          </main>
        </div>
      </div>
  );
}