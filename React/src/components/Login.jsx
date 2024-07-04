import React, { useContext, useState } from 'react';
import Navbar from './Navbar.jsx';
import { UserContext } from '../contexts/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }), 
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error during login');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/logout', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUser(null);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Error during logout');
    }
  };

  return (
    <>
      <Navbar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        setIdentifier={setIdentifier} 
        setPassword={setPassword}
        identifier={identifier} 
        password={password}
        error={error}
      />
    </>
  );
}
