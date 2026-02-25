import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext.jsx';
import './Header.css';

const NAV_LINKS = [
    { to: '/',        icon: '🏠', label: 'Головна',       end: true },
    { to: '/orders',  icon: '📋', label: 'Замовлення'            },
    { to: '/create',  icon: '➕', label: 'Створити'              },
    { to: '/import',  icon: '📤', label: 'Імпорт CSV'            },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const accountRef = useRef(null);

    const closeMobile = () => setMobileOpen(false);
    const closeAccount = () => setAccountOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setAccountOpen(false);
            }
        };

        if (accountOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [accountOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
        closeAccount();
        closeMobile();
    };

    const handleAccountClick = (path) => {
        navigate(path);
        closeAccount();
        closeMobile();
    };

    return (
        <>
            <header className="header">

                {/* Brand */}
                <Link to="/" className="header__brand" onClick={closeMobile}>
                    <span className="header__icon">🚁</span>
                    <div className="header__titles">
                        <span className="header__title">DroneDeliver</span>
                        <span className="header__subtitle">Sales Tax Admin</span>
                    </div>
                </Link>

                {/* Desktop nav */}
                {isAuthenticated && (
                    <nav className="header__nav">
                        {NAV_LINKS.map(({ to, icon, label, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                                }
                            >
                                <span className="header__nav-icon">{icon}</span>
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                )}

                {/* Right side */}
                <div className="header__right">
          <span className="header__badge">
            <span className="header__badge-dot" />
            NY State Compliant
          </span>

                    {/* Account dropdown */}
                    <div className="header__account-wrapper" ref={accountRef}>
                        <button
                            className="header__account-btn"
                            onClick={() => setAccountOpen((o) => !o)}
                            aria-label="Account menu"
                        >
                            <span className="header__account-icon">👤</span>
                            <span className="header__account-label">
                                {isAuthenticated && user ? (user.name || user.email) : 'Акаунт'}
                            </span>
                            <span className={`header__account-arrow ${accountOpen ? 'header__account-arrow--open' : ''}`}>▼</span>
                        </button>

                        {accountOpen && (
                            <div className="header__account-dropdown">
                                {!isAuthenticated ? (
                                    <>
                                        <button onClick={() => handleAccountClick('/login')} className="header__account-item">
                                            <span>🔑</span> Логін
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="header__account-user">
                                            <strong>{user?.name || user?.email}</strong>
                                        </div>
                                        <div className="header__account-divider" />
                                        <button onClick={handleLogout} className="header__account-item header__account-item--logout">
                                            <span>🚪</span> Вийти
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Burger */}
                    {isAuthenticated && (
                        <button
                            className="header__burger"
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-label="Toggle menu"
                        >
                            <span className="header__burger-line" />
                            <span className="header__burger-line" />
                            <span className="header__burger-line" />
                        </button>
                    )}
                </div>

            </header>

            {/* Mobile dropdown menu */}
            {isAuthenticated && (
                <div className={`header__mobile-menu ${mobileOpen ? 'header__mobile-menu--open' : ''}`}>
                    {NAV_LINKS.map(({ to, icon, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `header__mobile-link ${isActive ? 'header__mobile-link--active' : ''}`
                            }
                            onClick={closeMobile}
                        >
                            <span>{icon}</span>
                            {label}
                        </NavLink>
                    ))}

                    <div className="header__mobile-divider" />

                    <div className="header__mobile-user">
                        <span>👤</span>
                        <strong>{user?.name || user?.email}</strong>
                    </div>
                    <button onClick={handleLogout} className="header__mobile-link header__mobile-logout">
                        <span>🚪</span> Вийти
                    </button>
                </div>
            )}
        </>
    );
}