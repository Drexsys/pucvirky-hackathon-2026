import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header/Header.jsx';
import HomePage from './pages/Home/Home.jsx';
import OrdersPage from './pages/OrderPage/OrderPage.jsx';
import ImportPage from './pages/ImportPage/ImportPage.jsx';
import CreateOrderPage from './pages/CreateOrderPage/CreateOrderPage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import './App.css';

export default function App() {
  return (
      <div className="app-layout">
        <Header />
        <div className="app-body">
          <main className="app-main">
            <Routes>
              <Route path="/"        element={<HomePage />}        />
              <Route path="/orders"  element={<OrdersPage />}      />
              <Route path="/import"  element={<ImportPage />}      />
              <Route path="/create"  element={<CreateOrderPage />} />
              <Route path="/login"   element={<LoginPage />}       />
              <Route path="/register" element={<RegisterPage />}   />
            </Routes>
          </main>
        </div>
      </div>
  );
}