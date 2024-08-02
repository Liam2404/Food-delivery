import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SectionSpecialeEntreprise from './components/SectionEntreprise';
import RestaurantLogin from './components/RestauLogin';
import RestaurantRegister from './components/RestauRegister';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import RestauPannel from './components/RestauPannel';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';


function App() {
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isAdmin, setIsAdministrator] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsRestaurant(false);
    setIsAdministrator(false); 
    window.location.reload();
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log('Logged in user:', user);
      setIsAdministrator(user.isAdmin)
      setIsRestaurant(user.isRestaurant);
    }
  }, []);

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/restaurant/pannel"
            element={isRestaurant ? <RestauPannel /> : <Navigate to="/restaurant/login" />}
          />
          <Route path="/restaurant/section-speciale" element={<SectionSpecialeEntreprise />} />
          <Route path="/restaurant/register" element={<RestaurantRegister />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
