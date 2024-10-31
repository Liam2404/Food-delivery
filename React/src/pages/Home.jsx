import React, { useState, useEffect } from 'react';
import RestaurantMenu from '../components/RestaurantMenu';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [score, setScore] = useState(0); // État pour gérer la note

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

  // Fonction pour afficher la modale et récupérer les plats
  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
    fetchMeals(restaurant.id); // Récupérer les plats du restaurant sélectionné
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
    setMeals([]); // Réinitialiser les plats lorsque la modale est fermée
  };

  // Fonction pour gérer la recherche
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const submitScore = async (restaurantId) => {
    if (score < 1 || score > 5) {
        alert('Veuillez entrer une note entre 1 et 5.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/restaurant/add`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ restaurant_id: restaurantId, score }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la soumission de la note');
        }

        setScore(0);
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
      <section className="main-container">
        {/* Barre de recherche */}
        <div className="search-bar">
          <input 
            type="text"
            className="form-control"
            placeholder="Rechercher un restaurant"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="restaurant-grid">
  <div className="row">
    {filteredRestaurants.map(restaurant => (
      <div className="col-6 col-md-4 col-lg-3 mb-4" key={restaurant.id}>
        <div className="restaurant-card" onClick={() => handleCardClick(restaurant)}>
          {/* Image et Nom du restaurant */}
          <div className="image-wrapper">
            {restaurant.restaurant_img ? (
              <img 
                src={`http://localhost:3000${restaurant.restaurant_img}`}
                className="restaurant-img" 
                alt={restaurant.name} 
              />
            ) : (
              <div className="restaurant-img-placeholder">
                <span>Pas d'image disponible</span>
              </div>
            )}
          </div>
          <div className="card-body">
            <h5 className="restaurant-name">{restaurant.name}</h5>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      </section>
  
      {/* Modale pour afficher les détails du restaurant */}
      {showModal && selectedRestaurant && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <RestaurantMenu 
              restaurant={selectedRestaurant}
              meals={meals}
              handleCloseMenuSidebar={handleCloseModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
