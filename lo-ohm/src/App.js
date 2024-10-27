
import logo from './LoOhm.png';
import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Signup from './signup';  // Import the Signup component
import Login from './login';  // Import the Login component
import Popover from '@mui/material/Popover';

function App() {
  const [anchorElRegister, setAnchorElRegister] = React.useState(null);
  const [anchorElLogin, setAnchorElLogin] = React.useState(null);


  const handleRegisterClick = (event) => {
    setAnchorElRegister(event.currentTarget);
    setAnchorElLogin(null);
  };
  const handleLoginClick = (event) => {
    setAnchorElLogin(event.currentTarget);
    setAnchorElRegister(null);
  };

  const handleRegisterClose = () => {
    setAnchorElRegister(null);
  };
  const handleLoginClose = () => {
    setAnchorElLogin(null);
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{width: "20%", height:"20%"}}/>
        <p>
          Welcome to <code>Lo-Ohm</code>!
        </p>
        <header>
        <ButtonGroup variant="outlined" color="black" spacing="0.5rem">
          <Button aria-describedby="register-popover" onClick={handleRegisterClick}>Register</Button>
            <Popover id="register-popover" open={Boolean(anchorElRegister)} anchorEl={anchorElRegister} onClose={handleRegisterClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}
              transformOrigin={{vertical: 'top', horizontal: 'center',}}
            >
            <Signup />  {/* Render the Signup form */}
            </Popover>

            <Button aria-describedby="login-popover" onClick={handleLoginClick}>Log-In</Button>
          <Popover id="login-popover" open={Boolean(anchorElLogin)} anchorEl={anchorElLogin} onClose={handleLoginClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}
              transformOrigin={{vertical: 'top', horizontal: 'center',}}
            >
            <Login />  {/* Render the Login form */}
            </Popover>
          </ButtonGroup>
          
        </header>

      </header>
    </div>
  );
}

export default App;
