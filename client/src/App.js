import React from 'react';
import Header from './components/Header';
import ChangePassword from './components/ChangePassword'; 
import HeroSearch from './components/HeroSearch'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

function App() {


  return (
    
    <Router>
        <Header />

      
        <Routes>
        
        <Route path = '/index.html' element = {<HeroSearch />}></Route>


          
        <Route path = '/change-password' element = {<ChangePassword />}></Route>

        </Routes>
    
    </Router>
  );
}


export default App;








