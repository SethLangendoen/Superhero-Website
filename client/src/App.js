import React from 'react';
import Header from './components/Header';
import ChangePassword from './components/ChangePassword'; 
import HeroSearch from './components/HeroSearch'; 
import Lists from './components/Lists'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';


function HomePage() {
  return (
    <>
      <HeroSearch />
      <Lists />
    </>
  );
}

function App() {

  return (
    
    <Router>
        <Header />

      
        <Routes>
        
        <Route path = '/index.html' element = {<HomePage />}></Route>

          
        <Route path = '/change-password' element = {<ChangePassword />}></Route>

        </Routes>
    
    </Router>
  );
}



export default App;







