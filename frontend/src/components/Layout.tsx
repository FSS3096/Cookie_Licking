import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav-brand">
            Cookie-Licking Detector
          </Link>
          <div className="nav-items">
            {user && (
              <>
                <span className="nav-user">
                  {user.name} ({user.role})
                </span>
                <button onClick={handleLogout} className="nav-link">
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Cookie-Licking Detector</p>
      </footer>
    </div>
  );
};

export default Layout;