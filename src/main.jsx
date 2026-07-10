import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import FavoritarProvider from './Context/FavoritarProvider.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter> 
  <FavoritarProvider>
    <App />
  </FavoritarProvider>
  </BrowserRouter>
)