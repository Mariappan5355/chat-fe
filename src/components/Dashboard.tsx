import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserFriends, faInbox, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { getUser } from '../api/auth';
import { UserProvider } from '../contexts/UserContext';
import '../css/Dashboard.css';

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await getUser();
        setUserData(userData);
      } catch (error) {
        console.error('Failed to fetch user information', error);
        navigate('/login');
      }
    };

    if (!userData) {
      fetchUserInfo();
    }
  }, [userData, navigate]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Clear token from local storage or cookies (assuming you're using localStorage)
    localStorage.removeItem('token');
    // Navigate to the login page
    navigate('/login');
  };

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <button className="menu-button" onClick={toggleMenu}>
            <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
          </button>
        </div>
        <div className="header-right d-flex align-items-center">
          <FontAwesomeIcon icon={faUserFriends} />
          <span className="m-2">{userData?.name}</span>
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </header>
      <div className="flex-container">
        {menuOpen && (
          <nav className="nav">
            <ul>
              <li className={isActive('/dashboard/inbox')}>
                <Link to="/dashboard/inbox">
                  <FontAwesomeIcon icon={faInbox} /> Inbox
                </Link>
              </li>
              <li className={isActive('/dashboard/friends')}>
                <Link to="/dashboard/friends">
                  <FontAwesomeIcon icon={faUserFriends} /> Friends
                </Link>
              </li>
              <li className={isActive('/dashboard/all-users')}>
                <Link to="/dashboard/all-users">
                  <FontAwesomeIcon icon={faUsers} /> All Users
                </Link>
              </li>
              {/* Add more menu items as needed */}
            </ul>
          </nav>
        )}
        <main className="main">
          <UserProvider value={userData}>
            <Outlet />
          </UserProvider>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
