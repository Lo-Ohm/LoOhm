
import logo from './LoOhm.png';
import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Signup from './signup';  // Import the Signup component
import Popover from '@mui/material/Popover';

function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{width: "20%", height:"20%"}}/>
        <p>
          Welcome to <code>Lo-Ohm</code>!
        </p>
        <header>
        <ButtonGroup variant="outlined" color="black" spacing="0.5rem">
          <Button aria-describedby={id} onClick={handleClick}>Register</Button>
            <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center',}}
              transformOrigin={{vertical: 'top', horizontal: 'center',}}
            >
            <Signup />  {/* Render the Signup form */}
            </Popover>
          <Button>Log-In</Button>
          </ButtonGroup>
        </header>

      </header>
    </div>
  );
}

export default App;
