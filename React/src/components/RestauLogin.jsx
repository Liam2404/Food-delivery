import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function RestaurantLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/restaurant/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: usernameOrEmail, password }),
        credentials: 'include'
      });
    
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify({ ...data, isRestaurant: true }));
        navigate('/restaurant/pannel');
        console.log('Connexion réussi')
      } else {
        const data = await response.json();
        setError(data.message || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      setError('Erreur de connexion, veuillez réessayer plus tard.');
    }
    
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form style={{ width: '300px' }}>
        <h2 className="text-center">Connexion Restaurant</h2>
        <Form.Group controlId="usernameOrEmail">
          <Form.Label>Nom d'utilisateur ou Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrer votre nom d'utilisateur ou email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            autoComplete="username email"
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            placeholder="Entrer votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </Form.Group>

        {error && <p className="text-danger">{error}</p>}

        <Button variant="primary" onClick={handleLogin} className="mt-3 w-100">
          Se connecter
        </Button>
      </Form>
    </div>
  );
}

