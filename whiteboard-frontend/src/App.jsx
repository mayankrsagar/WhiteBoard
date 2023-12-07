import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './Components/Home';
import Login from './Auth/Login/login';
import Register from './Auth/Register/Registration';
import Dashboard from './pages/Dashboard/dashboard';
import Main from './pages/main/main';
import ClientRoom from './pages/Room/ClientRoom';
import JoinCreateRoom from './pages/Room/JoinCreateRoom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId('');
  };

  return (
    <div className="App">
      <Router>
        <nav class="navbar bg-dark border-bottom navbar-expand-lg border-body" data-bs-theme="dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">Whiteboard</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item me-4">
                  <Link className="nav-link active" to="/">Home</Link>
                </li>
                <li className="nav-item me-4">
                  <Link className="nav-link" to="/">Features</Link>
                </li>
                <li className="nav-item me-4">
                  <Link className="nav-link" to="/login">Login/Register</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>




        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route
            path="/login"
            element={loggedIn ? (
              <Dashboard userId={userId} onLogout={handleLogout} />
            ) : (
              <Login
                setLoggedIn={setLoggedIn}
                setUserId={setUserId}
              />
            )}
          />
          <Route path="/register" exact element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/ClientRoom" element={<ClientRoom />} />
          <Route path="/JoinCreateRoom" element={<JoinCreateRoom />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;