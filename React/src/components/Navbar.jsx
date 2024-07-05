import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import logo from '../assets/logo.png';

function Navbar({ handleLogin, setUsername, setPassword, username, password, error }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleLoginClose = () => setShowLoginModal(false);
  const handleLoginShow = () => setShowLoginModal(true);

  const handleRegisterClose = () => {
    setShowRegisterModal(false);
    setEmail('');
    setConfirmEmail('');
  };

  const handleRegisterShow = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleRegister = () => {
    if (email.trim() === '') {
      setError('Veuillez entrer une adresse email.');
      return;
    }
    if (email !== confirmEmail) {
      setError('Les adresses email ne correspondent pas.');
      return;
    }
    // Handle registration logic here
    alert('Inscription soumise');
    handleRegisterClose();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />

      <Link className="navbar-brand" to="/">
        Accueil
      </Link>

      <div className="ml-auto container d-flex justify-content-between">
        <Button variant="primary" onClick={handleLoginShow}>
          Connexion Client
        </Button>

        <Link to="/restaurant/section-speciale">
          <Button variant="dark" className="ml-2">
            Section Spéciale Entreprise
          </Button>
        </Link>
      </div>

      {/* Modal de Connexion */}
      <Modal show={showLoginModal} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connexion Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Nom d'utilisateur ou email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom d'utilisateur ou email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLoginClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Se connecter
          </Button>
          <Button variant="link" onClick={handleRegisterShow}>
            Pas encore de compte ? Inscrivez-vous ici.
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal d'Inscription */}
      <Modal show={showRegisterModal} onHide={handleRegisterClose}>
        <Modal.Header closeButton>
          <Modal.Title>Inscription Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Adresse email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group controlId="formConfirmEmail">
              <Form.Label>Confirmer adresse email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Confirmez votre adresse email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                autoComplete="new-password"
              />
            </Form.Group>
            {error && <p className="text-danger">{error}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRegisterClose}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleRegister}>
            S'inscrire
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  );
}

export default Navbar;
