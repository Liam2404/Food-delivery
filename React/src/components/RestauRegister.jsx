import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RestaurantRegister({ show, handleClose }) {
  const [name, setName] = useState('');
  const [email_address, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/restaurant/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email_address, password }),
      });

      if (response.ok) {
        const data = await response.json();
        register(data);
        navigate('/restauAdmin');
        if (handleClose) handleClose();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
      setError('Erreur lors de la création du compte');
    }
  };

  const registerForm = (
    <form>
      <div className="form-group">
        <label htmlFor="restaurant-name">Nom du restaurant</label>
        <input
          type="text"
          className="form-control"
          id="restaurant-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="restaurant-email_address">Email</label>
        <input
          type="email"
          className="form-control"
          id="restaurant-email"
          value={email_address}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="restaurant-password">Mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="restaurant-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-danger">{error}</p>}
    </form>
  );

  return (
    <>
      {show !== undefined ? (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Inscription Restaurant</Modal.Title>
          </Modal.Header>
          <Modal.Body>{registerForm}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
            <Button variant="primary" onClick={handleRegister}>
              S'inscrire
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <form style={{ width: '300px' }}>
            <h2 className="text-center">Inscription Restaurant</h2>
            {registerForm}
            <Button variant="primary" onClick={handleRegister} className="mt-3 w-100">
              S'inscrire
            </Button>
          </form>
        </div>
      )}
    </>
  );
}