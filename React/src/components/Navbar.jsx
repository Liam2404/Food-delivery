import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../assets/logo.png';

function Navigation() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [emailRegister, setEmailRegister] = useState('');
  const [confirmEmailRegister, setConfirmEmailRegister] = useState('');
  const [usernameRegister, setUsernameRegister] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [errorRegister, setErrorRegister] = useState('');
  const [user, setUser] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: emailLogin, password: passwordLogin }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEmailLogin('');
        setPasswordLogin('');
        setErrorLogin('');
        setUser(data); // Mettre à jour l'état utilisateur après la connexion
        handleLoginClose(); // Fermer le modal de connexion
      } else {
        const data = await response.json();
        setErrorLogin(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setErrorLogin('Erreur lors de la connexion');
    }
  };

  const handleRegister = async () => {
    if (emailRegister.trim() === '') {
      setErrorRegister('Veuillez entrer une adresse email.');
      return;
    }
    if (emailRegister !== confirmEmailRegister) {
      setErrorRegister('Les adresses email ne correspondent pas.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/user/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: usernameRegister, email_address: emailRegister, password: passwordRegister }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEmailRegister('');
        setConfirmEmailRegister('');
        setUsernameRegister('');
        setPasswordRegister('');
        setErrorRegister('');
        handleRegisterClose();
      } else {
        const data = await response.json();
        setErrorRegister(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      setErrorRegister('Erreur lors de la création du compte');
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/session', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Réponse non OK lors de la récupération de l\'utilisateur:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      setUser(null);
    }
  };

  const handleLoginClose = () => setShowLoginModal(false);
  const handleLoginShow = () => setShowLoginModal(true);

  const handleRegisterClose = () => {
    setShowRegisterModal(false);
    setEmailRegister('');
    setConfirmEmailRegister('');
    setUsernameRegister('');
    setPasswordRegister('');
  };
  const handleRegisterShow = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <Navbar expand="lg" expanded={expanded} style={{ borderRadius: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: 'rgb(255, 188, 13)' }}>
      <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
        <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px', borderRadius: '50%' }} />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : true)} />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {user ? (
            <>
              <Nav.Link disabled>Bonjour, {user.username}</Nav.Link>
              <Button variant="primary" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" onClick={handleLoginShow}>
                Connexion Client
              </Button>
              <Nav.Link as={Link} to="/restaurant/section-speciale">
                <Button variant="secondary" className="ml-2">
                  Section Spéciale Entreprise
                </Button>
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>

      <Modal show={showLoginModal} onHide={handleLoginClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connexion Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmailLogin">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group controlId="formPasswordLogin">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                autoComplete="current-password"
              />
            </Form.Group>
            {errorLogin && <p className="text-danger">{errorLogin}</p>}
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

      <Modal show={showRegisterModal} onHide={handleRegisterClose}>
        <Modal.Header closeButton>
          <Modal.Title>Inscription Client</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmailRegister">
              <Form.Label>Adresse email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Entrez votre adresse email"
                value={emailRegister}
                onChange={(e) => setEmailRegister(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group controlId="formConfirmEmailRegister">
              <Form.Label>Confirmer l'adresse email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Confirmez votre adresse email"
                value={confirmEmailRegister}
                onChange={(e) => setConfirmEmailRegister(e.target.value)}
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group controlId="formUsernameRegister">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez votre nom d'utilisateur"
                value={usernameRegister}
                onChange={(e) => setUsernameRegister(e.target.value)}
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group controlId="formPasswordRegister">
              <Form.Label>Mot de passe</Form.Label>
              <Form.Control
                type="password"
                placeholder="Entrez votre mot de passe"
                value={passwordRegister}
                onChange={(e) => setPasswordRegister(e.target.value)}
                autoComplete="new-password"
              />
            </Form.Group>
            {errorRegister && <p className="text-danger">{errorRegister}</p>}
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
    </Navbar>
  );
}

export default Navigation;
