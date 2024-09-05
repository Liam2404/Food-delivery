import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export default function RestaurantRegister() {
  const [name, setName] = useState('');
  const [email_address, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);  // Stocker l'image sélectionnée
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // FormData pour envoyer les données sous forme de multipart
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email_address', email_address);
      formData.append('password', password);
      if (image) {
        formData.append('image', image);  // Ajouter l'image au FormData
      }

      const response = await fetch('http://localhost:3000/api/restaurant/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,  // Envoyer les données sous forme de multipart/form-data
      });

      if (response.ok) {
        const data = await response.json();
        // Redirection vers la page d'administration du restaurant
        navigate('/restaurant/pannel');
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
        <label htmlFor="restaurant-email">Email</label>
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
      <div className="form-group">
        <label htmlFor="restaurant-image">Image du restaurant</label>
        <input
          type="file"
          className="form-control"
          id="restaurant-image"
          onChange={(e) => setImage(e.target.files[0])}  // Stocker le fichier image
        />
      </div>
      {error && <p className="text-danger">{error}</p>}
    </form>
  );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form style={{ width: '300px' }}>
        <h2 className="text-center">Inscription Restaurant</h2>
        {registerForm}
        <Button variant="primary" onClick={handleRegister} className="mt-3 w-100">
          S'inscrire
        </Button>
      </form>
    </div>
  );
}
