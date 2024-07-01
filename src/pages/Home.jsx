import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import RestaurantMenu from '../components/RestaurantMenu';

const restaurants = [
  {
    id: 1,
    name: "Restaurant A",
    cuisine: "Cuisine A",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum blandit augue, in ultricies nisl ullamcorper sed.",
    image: "https://via.placeholder.com/150",
    rating: 4.5,
    deliveryTime: "30-45 min",
    menu: [
      { id: 1, name: "Plat A1", price: 10.99 },
      { id: 2, name: "Plat A2", price: 12.99 },
      { id: 3, name: "Plat A3", price: 8.99 }
    ]
  },
  {
    id: 2,
    name: "Restaurant B",
    cuisine: "Cuisine B",
    description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    image: "https://via.placeholder.com/150",
    rating: 4.0,
    deliveryTime: "25-40 min",
    menu: [
      { id: 4, name: "Plat B1", price: 9.99 },
      { id: 5, name: "Plat B2", price: 11.99 },
      { id: 6, name: "Plat B3", price: 7.99 }
    ]
  },
  {
    id: 3,
    name: "Restaurant C",
    cuisine: "Cuisine C",
    description: "Fusce lobortis augue sit amet justo pellentesque, vel egestas libero vehicula.",
    image: "https://via.placeholder.com/150",
    rating: 4.8,
    deliveryTime: "20-35 min",
    menu: [
      { id: 7, name: "Plat C1", price: 11.50 },
      { id: 8, name: "Plat C2", price: 13.50 },
      { id: 9, name: "Plat C3", price: 10.00 }
    ]
  }
];

export default function HomePage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Restaurant sélectionné
  const [showMenuSidebar, setShowMenuSidebar] = useState(false); // État du menu latéral

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
      <Navbar />
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
