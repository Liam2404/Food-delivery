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


  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/restaurant/pannel" element={<RestauPannel />} />
          <Route path="/restaurant/section-speciale" element={<SectionSpecialeEntreprise />} />
          <Route path="/restaurant/register" element={<RestaurantRegister />} />
          <Route path="/restaurant/login" element={<RestaurantLogin setIsRestaurant/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
