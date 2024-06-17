import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Inbox from './components/Inbox';
import Friends from './components/Friends';
import AllUsers from './components/AllUsers';
import MessagingPage from './components/MessagingPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/inbox" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
        <Route path="" element={<Navigate to="inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="message/:userId" element={<MessagingPage />} />
          <Route path="friends" element={<Friends />} />
          <Route path="all-users" element={<AllUsers />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
