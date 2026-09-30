import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faMagnifyingGlass, faMoon, faRightFromBracket, faSun, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../theme/themeContext';
import './Navbar.css';

interface NavbarProps {
    onOpenQuickGenerate: () => void;
}

const LINKS = [
    { to: '/generate', label: 'Generate' },
    { to: '/browse', label: 'Collections' },
    { to: '/pricing', label: 'Pricing' },
];

const Navbar = ({ onOpenQuickGenerate }: NavbarProps) => {
    const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => setIsMenuOpen(false), [location.pathname]);

    const displayName = user?.name?.split('@')[0] || user?.nickname || 'Profile';
    const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);

    return (
        <header className="navbar">
            <Link to="/" className="brand" aria-label="ArchAI home">
                <span>Arch</span><span className="text-mint">AI</span>
            </Link>

            <button className="quick-generate-btn" onClick={onOpenQuickGenerate}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span>Imagine…</span>
                <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>

            <button
                className="icon-btn navbar-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-controls="navbar-menu"
                aria-label="Menu"
            >
                <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
            </button>

            <nav id="navbar-menu" className={`navbar-menu ${isMenuOpen ? 'open' : ''}`} aria-label="Main">
                {LINKS.map((link) => (
                    <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        {link.label}
                    </NavLink>
                ))}

                <div className="navbar-actions">
                    <button
                        className="icon-btn"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark-theme' ? 'Switch to light theme' : 'Switch to dark theme'}
                        title={theme === 'dark-theme' ? 'Light theme' : 'Dark theme'}
                    >
                        <FontAwesomeIcon icon={theme === 'dark-theme' ? faSun : faMoon} />
                    </button>

                    {isLoading ? (
                        <span className="spinner" aria-label="Loading account" />
                    ) : isAuthenticated ? (
                        <>
                            <NavLink to="/profile" className="profile-link" title="Your profile">
                                {user?.picture
                                    ? <img className="avatar" src={user.picture} alt="" referrerPolicy="no-referrer" />
                                    : <span className="avatar">{displayName[0]?.toUpperCase()}</span>}
                                <span className="profile-name">{displayName}</span>
                            </NavLink>
                            <button
                                className="icon-btn"
                                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                aria-label="Log out"
                                title="Log out"
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={() => loginWithRedirect({ appState: { returnTo: location.pathname } })}>
                            Log in
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
