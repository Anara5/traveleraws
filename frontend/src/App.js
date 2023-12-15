import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import PremiumContent from './components/PremiumContent/PremiumContent';
import Button from "./components/UI/Button/Button";
import { getUser, getToken, setUserSession, resetUserSession } from './service/AuthService';
import axios from 'axios';
import { PlacesProvider } from './components/UI/context/PlacesProvider';

const verifyTokenUrl = process.env.REACT_APP_VERIFY_URL;
const allPlacesUrl = process.env.REACT_APP_ALL_PLACES_URL;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getUser());
  const [authenticating, setAuthenticating] = useState(true);
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';
  const [initialUserPlaces, setItitialUserPlaces] = useState([]);

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
        .then(async (response) => {
          setUserSession(response.data.user, response.data.token);
          setIsLoggedIn(true);
          setAuthenticating(false);

          try {
            const userPlacesResponse = await axios.get(allPlacesUrl, {
              params: {
                username: user.username,
              },
            });
            setItitialUserPlaces(userPlacesResponse.data.places);
          } catch (error) {
            console.error('Error fetching user places:', error);
          }
        })
        .catch(() => {
          resetUserSession();
          setIsLoggedIn(false);
          setAuthenticating(false);
        });
    } else {
      setAuthenticating(false);
    }
  }, [user?.username]);

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
          {isLoggedIn && (<NavLink to="/premium-content">{name}'s page</NavLink>)}
          {isLoggedIn && (<Button onClick={logoutHandler}>Logout</Button>)}
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            {!isLoggedIn && <Route path="/register" element={<Register />} />}
            {!isLoggedIn && <Route path="/login" element={<Login onLogin={loginHandler} />} />}
            <Route
              path="/premium-content"
              element={isLoggedIn ?
                ( <PlacesProvider places={initialUserPlaces}>
                  <PremiumContent user={user} />
                </PlacesProvider> )
              : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;