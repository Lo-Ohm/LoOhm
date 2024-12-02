import './App.css';
import * as React from 'react';
import Signup from './signup';
import Login from './login';
import Profile from './profile';  // Add this import
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalogue from './catalogue';
import Chat from './chat';
import Cart from './cart';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
    
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />  
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;