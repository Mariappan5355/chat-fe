import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUserFriends, faInbox, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../css/Dashboard.css';
import { getUser } from '../api/auth';


const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
   
      const fetchUserInfo = async () => {
          try {
              const userData = await getUser();
              setUserData(userData);
          } catch (error) {
              console.error('Failed to fetch user information');
              navigate('/login');
          }
      };

      fetchUserInfo();
  }, [navigate]);


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
        </div>
      </header>
      <div className="flex-container">
        {menuOpen && (
          <nav className="nav">
            <ul>
              <li>
                <Link to="/dashboard/inbox">
                  <FontAwesomeIcon icon={faInbox} /> Inbox
                </Link>
              </li>
              <li>
                <Link to="/dashboard/friends">
                  <FontAwesomeIcon icon={faUserFriends} /> Friends
                </Link>
              </li>
              <li>
                <Link to="/dashboard/all-users">
                  <FontAwesomeIcon icon={faUsers} /> All Users
                </Link>
              </li>
            </ul>
          </nav>
        )}
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
