import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RestauPanel = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState({
    meal_name: '',
    meal_description: '',
    meal_price: '',
    meal_img: null,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/restaurant/meals/restaurant/:id', {
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
      });

      fetchMeals();
      setNewMeal({
        meal_name: '',
        meal_description: '',
        meal_price: '',
        meal_img: null,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(`http://localhost:3000/api/restaurant/meal/${mealId}`);
      fetchMeals();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/user/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  return (
    <div>
      <h1>Restaurant Admin Panel</h1>
      <button onClick={handleLogout}>Logout</button>
      {error && <p className="text-danger">{error}</p>}

      <div>
        <h2>Add New Meal</h2>
        <input
          type="text"
          name="meal_name"
          placeholder="Meal Name"
          value={newMeal.meal_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="meal_description"
          placeholder="Meal Description"
          value={newMeal.meal_description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="meal_price"
          placeholder="Meal Price"
          value={newMeal.meal_price}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="meal_img"
          onChange={handleImageChange}
        />
        <button onClick={handleAddMeal}>Add Meal</button>
      </div>

      <div>
        <h2>Meals</h2>
        <ul>
          {Array.isArray(meals) && meals.map((meal) => (
            <li key={meal.meal_id}>
              <p>{meal.meal_name}</p>
              <p>{meal.meal_description}</p>
              <p>{meal.meal_price}</p>
              {meal.meal_img && <img src={`http://localhost:3000/${meal.meal_img}`} alt={meal.meal_name} />}
              <button onClick={() => handleDeleteMeal(meal.meal_id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestauPanel;
