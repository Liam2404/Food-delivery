import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const RestaurantMenu = ({ restaurant, meals, handleCloseMenuSidebar }) => {
  const [cart, setCart] = useState([]);

  // Fonction pour ajouter un plat au panier
  const addToCart = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
  };

  // Fonction pour calculer le total du panier avec 2 décimales
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + parseFloat(item.meal_price), 0).toFixed(2);
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
  };

  return (
    <Modal show={true} onHide={handleCloseMenuSidebar} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Menu de {restaurant.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Vérification si le menu existe et contient des éléments */}
        {meals && meals.length > 0 ? (
          <ListGroup variant="flush">
            {meals.map(item => (
              <ListGroup.Item key={item.id}>
                <div className="d-flex w-100 justify-content-between">
                  <div>
                    <h5>{item.meal_name}</h5>
                    <p>{item.meal_description}</p>
                    <p className="mb-0">Prix: {parseFloat(item.meal_price).toFixed(2)} €</p>
                  </div>
                  {/* Affichage de l'image du plat */}
                  {item.meal_img ? (
                    <img
                      src={`http://localhost:3000${item.meal_img}`}
                      alt={item.meal_name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-light d-flex justify-content-center align-items-center" style={{ width: '100px', height: '100px' }}>
                      <span>Pas d'image</span>
                    </div>
                  )}
                  <Button variant="primary" onClick={() => addToCart(item)}>Ajouter au panier</Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Aucun plat disponible pour ce restaurant.</p>
        )}

        {/* Affichage du panier */}
        {cart.length > 0 && (
          <div className="mt-3">
            <h5>Panier</h5>
            <ListGroup>
              {cart.map((item, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex w-100 justify-content-between">
                    <span>{item.meal_name}</span>
                    <span>{parseFloat(item.meal_price).toFixed(2)} €</span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <hr />
            <p className="text-right">Total: {calculateTotal()} €</p>
            <Button variant="danger" onClick={clearCart}>Vider le panier</Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseMenuSidebar}>
          Fermer
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // Remplacez par un utilisateur réel si nécessaire
            const userId = user.id;
            const url = `https://buy.stripe.com/test_7sI16We6Ah0LfDi3cc?client_reference_id=${userId}`;
            window.location.href = url;
          }}
        >
          Commander
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantMenu;
