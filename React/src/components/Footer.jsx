import React from 'react';
import Logout from './Logout';

const Footer = ({ handleLogout }) => {
  return (
    <footer>
      <div className="container">
        <button onClick={handleLogout}>Déconnexion</button>
      </div>
    </footer>
  );
};

export default Footer;
