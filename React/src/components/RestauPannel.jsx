import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestauPanel = () => {
  const [meals, setMeals] = useState([]);
  const [restaurant, setRestaurant] = useState(null);  
  const [newMeal, setNewMeal] = useState({
    meal_name: '',
    meal_description: '',
    meal_price: '',
    meal_img: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRestaurant = JSON.parse(localStorage.getItem('user'));
    
    if (storedRestaurant && storedRestaurant.isRestaurant) {
      setRestaurant(storedRestaurant);
    } else {
      setError('Aucun restaurant connecté');
    }
  }, []);
  
  useEffect(() => {
    if (restaurant) {
      fetchMeals();
    }
  }, [restaurant]);
  
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
    <div style={{ padding: '20px' }}>
      <h1>{restaurant ? `Restaurant: ${restaurant.name}` : 'Chargement...'}</h1>
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
        <ul style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '20px', 
          listStyle: 'none', 
          padding: 0 
        }}>
          {Array.isArray(meals) && meals.map((meal) => (
            <li key={meal.meal_id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '10px',
              boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' 
            }}>
              <p><strong>{meal.meal_name}</strong></p>
              <p>{meal.meal_description}</p>
              <p>{meal.meal_price} €</p>
              {meal.meal_img && (
                <img 
                  src={`http://localhost:3000/${meal.meal_img}`} 
                  alt={meal.meal_name} 
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px' 
                  }} 
                />
              )}
              <button 
                onClick={() => handleDeleteMeal(meal.meal_id)} 
                style={{
                  marginTop: '10px',
                  backgroundColor: '#ff4d4d', 
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestauPanel;
