import './App.css';
import * as React from 'react';
import Signup from './signup';  // Import the Signup component
import Login from './login';  // Import the Login component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Catalogue from './catalogue';
import Chat from './chat';

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
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
