import React from 'react';
import './Home.css';

function Home() {
  return (
    <main className="home">
      <h1 className="home__title">Home page test</h1>
      <p className="home__subtitle">If you see this, React is rendering.</p>
      <div className="home__card">
        <button className="home__button" type="button">Test button</button>
      </div>
    </main>
  );
}

export default Home;
