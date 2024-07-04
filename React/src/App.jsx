import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RestaurantLogin from './components/RestauLogin.jsx';
import RestraurantRegister from './components/RestauRegister.jsx'
import Login from './components/Login.jsx';
import Home from './pages/Home.jsx';
import './App.css';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/restaurant/register" element={<RestraurantRegister />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
