import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Checkout from './Checkout';

const RestaurantMenu = ({ restaurant, meals, handleCloseMenuSidebar }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState(0); // État pour le total

  // Fonction pour ajouter un plat au panier
  const addToCart = (item) => {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
    console.log("Plat ajouté au panier:", item);
    console.log("Contenu du panier:", updatedCart);
  };


  // Fonction pour calculer le total du panier
  const calculateTotal = () => {
    const total = cart.reduce((total, item) => total + parseFloat(item.meal_price), 0);
    console.log("Total calculé:", total);
    return total;
  };


  // Mettre à jour le total chaque fois que le panier change
  useEffect(() => {
    const newTotal = calculateTotal();
    setTotal(newTotal);
  }, [cart]); // Dépendance sur cart

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]);
  };

  const initialOptions = {
    "client-id": "AcrTJxSOmYKZwh6NcDa5sNTXZC5x4aMtRAwU-fqWFwiKwaau_dXvLuIClPSbgEvIytXo8QZq2cMzllCu",
    currency: "EUR",
    intent: "capture",
    debug: true,
  };

  // Récupérer les informations de l'utilisateur à partir du localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Modal show={true} onHide={handleCloseMenuSidebar} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Menu de {restaurant.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <p className="text-right">Total: {total.toFixed(2)} €</p> {/* Affichage du total */}
            <Button variant="danger" onClick={clearCart}>Vider le panier</Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseMenuSidebar}>
          Fermer
        </Button>
        <PayPalScriptProvider options={initialOptions}>
          <Checkout total={total} />
        </PayPalScriptProvider>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantMenu;
