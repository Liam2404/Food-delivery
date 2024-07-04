import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import logo from '../assets/logo.png';
import Register from './Register'; 

function Navbar({ handleLogin, handleLogout, setIdentifier, setPassword, identifier, password, error }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); 

  const handleLoginClose = () => setShowLoginModal(false);
  const handleLoginShow = () => setShowLoginModal(true);
  const handleRegisterClose = () => setShowRegisterModal(false); 
  const handleRegisterShow = () => setShowRegisterModal(true); 

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />
      <Link className="navbar-brand" to="/">Accueil</Link>

      <Button variant="primary" onClick={handleLoginShow}>Se connecter</Button>
      <Button variant="secondary" onClick={handleRegisterShow}>S'inscrire</Button> 

      <Modal show={showLoginModal} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connexion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="identifier">Nom d'utilisateur ou email</label>
              <input
                type="text"
                className="form-control"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLoginClose}>Fermer</Button>
          <Button variant="primary" onClick={handleLogin}>Se connecter</Button>
        </Modal.Footer>
      </Modal>

      <Register show={showRegisterModal} handleClose={handleRegisterClose} /> 
    </nav>
  );
}

export default Navbar;
