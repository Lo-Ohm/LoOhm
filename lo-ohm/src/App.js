import logo from './LoOhm.png';
import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Signup from './signup';  // Import the Signup component
import Login from './login';  // Import the Login component
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
    
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
