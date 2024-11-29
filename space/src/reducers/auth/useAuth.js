// useAuth.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActionTypes } from '../../reducers/authReducer';

const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuthStateString = localStorage.getItem('authState');

    try {
      const storedAuthState = JSON.parse(storedAuthStateString);

      if (storedAuthState && storedAuthState.token) {
        dispatch({
          type: authActionTypes.LOGIN,
          payload: {
            user: storedAuthState.user,
            isAuthenticated: true,
            token: storedAuthState.token,
          },
        });
      }
    } catch (error) {
      console.error('Error parsing stored auth state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const login = (responseData) => {
    dispatch({
        type: authActionTypes.LOGIN,
        payload: {
            user: responseData.user,
            isAuthenticated: (responseData.message === 'Login successful.' || responseData.message === 'User registered successfully.'),
            token: responseData.token,  // Use the provided token or the one from the response
        },
    });
    // Save authentication state to localStorage
    localStorage.setItem('authState', JSON.stringify({ user: responseData.user, token: responseData.token }));
};

const switchProfile = (responseData) => {
  logout();
  login(responseData);
  window.location.href = '/';
};


  const logout = () => {
    dispatch({ type: authActionTypes.LOGOUT });

    // Clear authentication state from localStorage
    localStorage.removeItem('authState');

    // You can perform additional logout actions here
    // e.g., redirect to the login page
    window.location.href = '/access/login';
  };

  return { authState, isLoading, login, logout, switchProfile };
};

export { useAuth };