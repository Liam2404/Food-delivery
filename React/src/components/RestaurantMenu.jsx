import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

const RestaurantMenu = ({ restaurant, handleCloseMenuSidebar }) => {
  const [cart, setCart] = useState([]);

  // Fonction pour ajouter un plat au panier
  const addToCart = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
  };

  // Fonction pour calculer le total du panier
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
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
        <ListGroup variant="flush">
          {restaurant.menu.map(item => (
            <ListGroup.Item key={item.id}>
              <div className="d-flex w-100 justify-content-between">
                <h5>{item.name}</h5>
                <p className="mb-0">Prix: {item.price} €</p>
                <Button variant="primary" onClick={() => addToCart(item)}>Ajouter au panier</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {cart.length > 0 && (
          <div className="mt-3">
            <h5>Panier</h5>
            <ListGroup>
              {cart.map((item, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex w-100 justify-content-between">
                    <span>{item.name}</span>
                    <span>{item.price} €</span>
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
