import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import PremiumContent from './components/PremiumContent/PremiumContent';
import Button from "./components/UI/Button/Button";
import { getUser, getToken, setUserSession, resetUserSession } from './service/AuthService';
import axios from 'axios';

const verifyTokenUrl = process.env.REACT_APP_VERIFY_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getUser());
  const [authenticating, setAuthenticating] = useState(true);

  const logoutHandler = () => {
    resetUserSession();
    setIsLoggedIn(false);
  };

  const loginHandler = () => {
    setAuthenticating(false);
    setIsLoggedIn(true);
  }

  useEffect(() => {
    const token = getToken();
    if (token) {
      const requestConfig = {
        headers: {
          'x-api-key': process.env.REACT_APP_X_API_KEY,
        },
      };
      const requestBody = {
        user: getUser(),
        token: token,
      };

      axios.post(verifyTokenUrl, requestBody, requestConfig)
        .then(response => {
          setUserSession(response.data.user, response.data.token);
          setIsLoggedIn(true);
          setAuthenticating(false);
        })
        .catch(() => {
          resetUserSession();
          setIsLoggedIn(false);
          setAuthenticating(false);
        });
    } else {
      setAuthenticating(false);
    }
  }, []);

  const token = getToken();
  if (authenticating && token) {
    return <div className='content'>Authenticating...</div>;
  };

  return (
    <Router>
      <div className="App">
        <div className='header'>
          <NavLink to="/">Home</NavLink>
          {!isLoggedIn && (<NavLink to="/register">Register</NavLink>)}
          {!isLoggedIn && (<NavLink to="/login">Login</NavLink>)}
          {isLoggedIn && (<NavLink to="/premium-content">Premium content</NavLink>)}
          {isLoggedIn && (<Button onClick={logoutHandler}>Logout</Button>)}
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            {!isLoggedIn && <Route path="/register" element={<Register />} />}
            {!isLoggedIn && <Route path="/login" element={<Login onLogin={loginHandler} />} />}
            <Route
              path="/premium-content"
              element={isLoggedIn ? <PremiumContent /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;