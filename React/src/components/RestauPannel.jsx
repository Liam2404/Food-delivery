import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestauPanel = () => {
  const [meals, setMeals] = useState([]);
  const [restaurant, setRestaurant] = useState(null);  // Ajout de l'état pour le restaurant
  const [newMeal, setNewMeal] = useState({
    meal_name: '',
    meal_description: '',
    meal_price: '',
    meal_img: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les informations du restaurant depuis le localStorage
    const storedRestaurant = JSON.parse(localStorage.getItem('user'));
    
    if (storedRestaurant && storedRestaurant.isRestaurant) {
      setRestaurant(storedRestaurant);
    } else {
      setError('Aucun restaurant connecté');
    }

    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/restaurant/meals/restaurant/${restaurant.id}`, {
        withCredentials: true  
      });
      setMeals(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeal({ ...newMeal, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewMeal({ ...newMeal, meal_img: e.target.files[0] });
  };

  const handleAddMeal = async () => {
    const formData = new FormData();
    for (const key in newMeal) {
      formData.append(key, newMeal[key]);
    }

    try {
      await axios.post('http://localhost:3000/api/restaurant/meal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      fetchMeals();
      setNewMeal({
        meal_name: '',
        meal_description: '',
        meal_price: '',
        meal_img: '',
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(`http://localhost:3000/api/restaurant/meal/${mealId}`, {
        withCredentials: true
      });
      fetchMeals();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div>
      <h1>{restaurant ? `Restaurant: ${restaurant.name}` : 'Chargement...'}</h1> {/* Affichage du nom du restaurant */}
      <button onClick={handleLogout}>Se déconnecter</button>
      {error && <p className="text-danger">{error}</p>}

      <div>
        <h2>Ajouter un nouveau plat</h2>
        <input
          type="text"
          name="meal_name"
          placeholder="Nom du plat"
          value={newMeal.meal_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="meal_description"
          placeholder="Description du plat"
          value={newMeal.meal_description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="meal_price"
          placeholder="Prix du plat"
          value={newMeal.meal_price}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="meal_img"
          onChange={handleImageChange}
        />
        <button onClick={handleAddMeal}>Ajouter un plat</button>
      </div>

      <div>
        <h2>Plats</h2>
        <ul>
          {Array.isArray(meals) && meals.map((meal) => (
            <li key={meal.meal_id}>
              <p>{meal.meal_name}</p>
              <p>{meal.meal_description}</p>
              <p>{meal.meal_price}</p>
              {meal.meal_img && <img src={`http://localhost:3000/${meal.meal_img}`} alt={meal.meal_name} />}
              <button onClick={() => handleDeleteMeal(meal.meal_id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestauPanel;
