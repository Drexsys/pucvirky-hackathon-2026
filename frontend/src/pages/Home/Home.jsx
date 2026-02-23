import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <main className="home">
      <h1 className="home__title">🚁 DroneDeliver Admin</h1>
      <p className="home__subtitle">Система управління замовленнями з автоматичним розрахунком податків</p>

      <div className="home__features">
        <Link to="/create" className="home__card">
          <div className="card__icon">➕</div>
          <h3>Створити замовлення</h3>
          <p>Введіть координати (lat, lon) та суму — податок розрахується автоматично</p>
        </Link>

        <Link to="/import" className="home__card">
          <div className="card__icon">📤</div>
          <h3>Імпорт CSV</h3>
          <p>Завантажте CSV файл із замовленнями для масової обробки</p>
        </Link>

        <Link to="/orders" className="home__card">
          <div className="card__icon">📋</div>
          <h3>Список замовлень</h3>
          <p>Перегляд всіх замовлень з фільтрацією, сортуванням та пагінацією</p>
        </Link>
      </div>

      <div className="home__info">
        <h3>Як це працює?</h3>
        <ol>
          <li>Створіть замовлення вручну або імпортуйте з CSV</li>
          <li>Система автоматично розраховує податок на основі координат</li>
          <li>Переглядайте всі замовлення з розрахованими податками в таблиці</li>
        </ol>
      </div>
    </main>
  );
}

export default Home;
