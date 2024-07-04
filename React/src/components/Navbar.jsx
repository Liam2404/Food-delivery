import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import Register from './Register';
import RestaurantRegister from './RestauRegister';
import logo from '../assets/logo.png';

function Navbar({ handleLogin, setUsername, setPassword, username, password, error }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRestaurantRegisterModal, setShowRestaurantRegisterModal] = useState(false);

  const handleLoginClose = () => setShowLoginModal(false);
  const handleLoginShow = () => setShowLoginModal(true);

  const handleRegisterClose = () => setShowRegisterModal(false);
  const handleRegisterShow = () => setShowRegisterModal(true);

  const handleRestaurantRegisterClose = () => setShowRestaurantRegisterModal(false);
  const handleRestaurantRegisterShow = () => setShowRestaurantRegisterModal(true);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />

      <Link className="navbar-brand" to="/">
        Accueil
      </Link>

      <div className="ml-auto">
        <Button variant="primary" onClick={handleLoginShow}>
          Connexion Client
        </Button>
        <Button variant="success" onClick={handleRegisterShow} className="ml-2">
          Inscription Client
        </Button>
        <Link to="/restaurant/login">
          <Button variant="secondary" className="ml-2">
            Connexion Restaurant
          </Button>
        </Link>
        <Link to="/restaurant/register">
          <Button variant="info" className="ml-2">
            Inscription Restaurant
          </Button>
        </Link>
      </div>

      <Modal show={showLoginModal} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connexion Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur ou email</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
          <Button variant="secondary" onClick={handleLoginClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Se connecter
          </Button>
        </Modal.Footer>
      </Modal>

      <Register show={showRegisterModal} handleClose={handleRegisterClose} setUser={() => {}} />
      <RestaurantRegister show={showRestaurantRegisterModal} handleClose={handleRestaurantRegisterClose} setRestaurant={() => {}} />
    </nav>
  );
}

export default Navbar;
