import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SectionSpecialeEntreprise from './components/SectionEntreprise';
import RestaurantLogin from './components/RestauLogin';
import RestaurantRegister from './components/RestauRegister';
import Login from './components/Login';
import Register from './components/Register';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import RestauPannel from './components/RestauPannel';
import Footer from './components/Footer'; 
import './App.css';

function App() {

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      console.log('Logged in user:', user);
    }
  }, []);
  
  return (
    <div>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/restaurant/pannel" element={<RestauPannel />} />
              <Route path="/restaurant/section-speciale" element={<SectionSpecialeEntreprise />} />
              <Route path="/restaurant/register" element={<RestaurantRegister />} />
              <Route path="/restaurant/login" element={<RestaurantLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
            </Routes>
            <Footer handleLogout={handleLogout} />
          </Router>
    </div>
  );
}

export default App;
