import logo from './LoOhm.png';
import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{width: "20%", height:"20%"}}/>
        <p>
          Welcome to <code>Lo-Ohm</code>!
        </p>
        <header>
        <ButtonGroup variant="outlined" color="black" spacing="0.5rem">
          <Button>Register</Button>
          <Button>Log-In</Button>
          </ButtonGroup>
        </header>
        
      </header>
      
    </div>
    
  );
}

export default App;
