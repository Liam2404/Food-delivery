import React, { useState, useEffect } from 'react';
import RestaurantMenu from '../components/RestaurantMenu';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showMenuSidebar, setShowMenuSidebar] = useState(false);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rating, setRating] = useState(0); // État pour gérer la note

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

  // Fonction pour récupérer les plats d'un restaurant spécifique
  const fetchMeals = async (restaurantId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/restaurant/meals/restaurant/${restaurantId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des plats');
      }

      const data = await response.json();
      setMeals(data); // Mettre à jour les plats avec ceux du restaurant sélectionné
    } catch (error) {
      console.error('Erreur lors de la récupération des plats :', error);
    }
  };

  // Utiliser useEffect pour appeler la fonction fetchRestaurants au chargement du composant
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Fonction pour afficher le menu latéral et récupérer les plats
  const handleShowMenuSidebar = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowMenuSidebar(true);
    fetchMeals(restaurant.id); // Récupérer les plats du restaurant sélectionné
  };

  // Fonction pour masquer le menu latéral
  const handleCloseMenuSidebar = () => {
    setShowMenuSidebar(false);
    setSelectedRestaurant(null);
    setMeals([]); // Réinitialiser les plats lorsque le menu est fermé
  };

  // Fonction pour gérer la recherche
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fonction pour soumettre la note
  const submitRating = async (restaurantId) => {
    if (rating < 1 || rating > 5) {
      alert('Veuillez entrer une note entre 1 et 5.');
      return; // Empêche la soumission si la note est en dehors des limites
    }

    try {
      const response = await fetch(`http://localhost:3000/api/rating/${restaurantId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la note');
      }

      // Réinitialiser la note après soumission
      setRating(0);
      // Optionnel : Rafraîchir les données du restaurant pour mettre à jour la note moyenne
      fetchRestaurants();
    } catch (error) {
      console.error('Erreur lors de la soumission de la note :', error);
    }
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
          {filteredRestaurants.map(restaurant => (
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
                  {/* Section pour noter le restaurant */}
                  <div>
                    <label htmlFor={`rating-${restaurant.id}`}>Note:</label>
                    <input 
                      type="number" 
                      id={`rating-${restaurant.id}`} 
                      min="1" 
                      max="5" 
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)} 
                      style={{ width: '60px', marginLeft: '5px' }}
                    />
                    <button 
                      className="btn btn-secondary ms-2" 
                      onClick={() => submitRating(restaurant.id)}
                    >
                      Soumettre
                    </button>
                  </div>
                  <button className="btn btn-primary mt-2" onClick={() => handleShowMenuSidebar(restaurant)}>Voir le menu</button>
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
          meals={meals} // Transmettre les plats au composant RestaurantMenu
          handleCloseMenuSidebar={handleCloseMenuSidebar}
        />
      )}
    </>
  );
}
