import React from 'react';
import Header from './components/Header';
import ChangePassword from './components/ChangePassword'; 
import HeroSearch from './components/HeroSearch'; 
import Lists from './components/Lists'; 
import SiteMaintenance from './components/SiteMaintenance'; 
import Policies from './components/Policies'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';



function HomePage() {
  return (
    <div className="home-page-container">
      <div className="hero-search-container">
        <HeroSearch />
      </div>
      <div className="lists-container">
        <Lists />
      </div>
    </div>
  );
}



function App() {

  return (
    
    <Router>
        <Header />

        <Routes> 
        <Route path = '/index.html' element = {<HomePage />}></Route>
        <Route path = '/site-maintenance' element = {<SiteMaintenance />}></Route>
        <Route path = '/view-policies' element = {<Policies />}></Route>
        <Route path = '/change-password' element = {<ChangePassword />}></Route>

        </Routes>
    
    </Router>
  );
}



export default App;








