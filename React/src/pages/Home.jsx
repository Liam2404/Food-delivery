import React, { useState, useEffect } from 'react';
import RestaurantMenu from '../components/RestaurantMenu';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);

  // Fonction pour récupérer les restaurants
  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/restaurant', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des restaurants');
      }

      const data = await response.json();
      setRestaurants(data); // Mettre à jour l'état avec les données récupérées
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants :', error);
    }
  };

  // Utiliser useEffect pour appeler la fonction fetchRestaurants au chargement du composant
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fonction pour afficher le menu latéral
  const handleShowMenuSidebar = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMenuSidebar(true);
  };

  // Fonction pour masquer le menu latéral
  const handleCloseMenuSidebar = () => {
    setShowMenuSidebar(false);
  };

  return (
    <>
      <section className="container mt-4">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {restaurants.map(restaurant => (
            <div className="col mb-4" key={restaurant.id}>
              <div className="card h-100">
                <img src={restaurant.image} className="card-img-top" alt={restaurant.name} />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">{restaurant.description}</p>
                  <p className="card-text">Cuisine: {restaurant.cuisine}</p>
                  <p className="card-text">Note: {restaurant.rating}</p>
                  <p className="card-text">Temps de livraison: {restaurant.deliveryTime}</p>
                  <button className="btn btn-primary" onClick={() => handleShowMenuSidebar(restaurant)}>Voir le menu</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar pour afficher le menu */}
      {showMenuSidebar && selectedRestaurant && (
        <RestaurantMenu
          restaurant={selectedRestaurant}
          handleCloseMenuSidebar={handleCloseMenuSidebar}
        />
      )}
    </>
  );
}
