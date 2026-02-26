import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProtectedClick = (path) => (event) => {
    if (isAuthenticated) {
      return;
    }
    event.preventDefault();
    navigate('/login', { state: { from: { pathname: path } } });
  };

  return (
    <main className="home">
      <h1 className="home__title">🚁 DroneDeliver Admin</h1>
      <p className="home__subtitle">Order management system with automatic tax calculation</p>

      <div className="home__features">
        <Link to="/create" className="home__card" onClick={handleProtectedClick('/create')}>
          <div className="card__icon">➕</div>
          <h3>Create Order</h3>
          <p>Enter coordinates (lat, lon) and amount — tax will be calculated automatically</p>
        </Link>

        <Link to="/import" className="home__card" onClick={handleProtectedClick('/import')}>
          <div className="card__icon">📤</div>
          <h3>Import CSV</h3>
          <p>Upload a CSV file with orders for bulk processing</p>
        </Link>

        <Link to="/orders" className="home__card" onClick={handleProtectedClick('/orders')}>
          <div className="card__icon">📋</div>
          <h3>Orders List</h3>
          <p>View all orders with filtering, sorting, and pagination</p>
        </Link>
      </div>

      <div className="home__info">
        <h3>How does it work?</h3>
        <ol>
          <li>Create an order manually or import from CSV</li>
          <li>The system automatically calculates tax based on coordinates</li>
          <li>View all orders with calculated taxes in a table</li>
        </ol>
      </div>
    </main>
  );
}

