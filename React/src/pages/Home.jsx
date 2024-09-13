import React, { useState, useEffect } from 'react';
import RestaurantMenu from '../components/RestaurantMenu';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 

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

  // Fonction pour gérer la recherche
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrer les restaurants en fonction du texte de recherche
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <section className="container mt-4">
        {/* Barre de recherche */}
        <div className="mb-4">
          <input 
            type="text"
            className="form-control"
            placeholder="Rechercher un restaurant"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {filteredRestaurants.map(restaurant => {
            console.log(restaurant);
            
            return (
            <div className="col mb-4" key={restaurant.id}>
              <div className="card h-100" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                {/* Vérification si l'image existe */}
                {restaurant.restaurant_img ? (
                  <img 
                    src={`http://localhost:3000${restaurant.restaurant_img}`}
                    className="card-img-top" 
                    alt={restaurant.name} 
                    style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} 
                  />
                ) : (
                  <div className="card-img-top bg-light d-flex justify-content-center align-items-center" style={{ height: '200px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <span>Pas d'image disponible</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-text">{restaurant.description}</p>
                  <p className="card-text">Cuisine: {restaurant.food_type}</p>
                  <p className="card-text">Note: {restaurant.rating}</p>
                  <p className="card-text">Temps de livraison: {restaurant.deliveryTime}</p>
                  <button className="btn btn-primary" onClick={() => handleShowMenuSidebar(restaurant)}>Voir le menu</button>
                </div>
              </div>
            </div>
          )})}
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
