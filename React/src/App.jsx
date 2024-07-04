import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SectionSpecialeEntreprise from './components/SectionEntreprise';
import RestaurantLogin from './components/RestauLogin';
import RestaurantRegister from './components/RestauRegister';
import Login from './components/Login';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/restaurant/section-speciale" element={<SectionSpecialeEntreprise />} />
          <Route path="/restaurant/register" element={<RestaurantRegister />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
