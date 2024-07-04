import React, { useContext } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.css';
import { UserContext } from '../contexts/UserContext';

export default function Logout() {
  const { user, setUser } = useContext(UserContext);
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/logout', {
        method: 'POST',
      });

      if (response.ok) {
        console.log('Logout successful');
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <Navbar />
    <br/>
      <button type="button" className="btn btn-light" rel="noreferrer" onClick={handleLogout}>Logout</button>
    </>
  );
}
