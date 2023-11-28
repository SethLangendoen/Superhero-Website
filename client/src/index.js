
import React from 'react';
// import ReactDOM from 'react-dom';
// import { BrowserRouter as Router} from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client'; 

const root = document.getElementById('root'); 
const root2 = createRoot(root); 
root2.render(<App />)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
