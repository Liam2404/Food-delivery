import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function SectionSpecialeEntreprise() {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="mb-4 text-center">Section Spéciale Entreprise</h1>
        <div className="container d-flex flex-column justify-content-center align-items-center">
          <div className="mb-3 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
            <Link to="/restaurant/login" className="btn btn-primary btn-lg mb-3 mb-md-0">
              Connexion Restaurant
            </Link>
            <Link to="/restaurant/register" className="btn btn-info btn-lg">
              Inscription Restaurant
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SectionSpecialeEntreprise;
