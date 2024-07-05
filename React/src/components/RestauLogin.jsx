import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Navbar from './Navbar';

export default function RestaurantLogin({ show, handleClose }) {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/restaurant/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameOrEmail, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Stocker les informations de connexion ou rediriger
                navigate('/restauAdmin');
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setError('Erreur lors de la connexion');
        }
    };

    const loginForm = (
        <Form>
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
        </Form>
    );

    return (
        <>
            {show !== undefined ? (
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Connexion Restaurant</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{loginForm}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Fermer
                        </Button>
                        <Button variant="primary" onClick={handleLogin}>
                            Se connecter
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <>
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <Form style={{ width: '300px' }}>
                            <h2 className="text-center">Connexion Restaurant</h2>
                            {loginForm}
                            <Button variant="primary" onClick={handleLogin} className="mt-3 w-100">
                                Se connecter
                            </Button>
                        </Form>
                    </div>
                </>
            )}
        </>
    );
}
