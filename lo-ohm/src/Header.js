
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './LoOhmWh.png';

function Header() {
    const navigate = useNavigate();

    return (
        <header className="cat-header">
            <div className="header-content">
                <div className="header-logo">
                    <img 
                        src={logo}
                        alt="Company Logo" 
                        className="logo-image"
                    />
                </div>
                <nav className="header-nav">
                    <button className="header-btn" onClick={() => navigate('/chat')}>Chat</button>
                    <button className="header-btn" onClick={() => navigate('/profile')}>Profile</button>
                    <button className="header-btn" onClick={() => navigate('/catalogue')}>Products</button>
                    <button className="header-btn">Cart</button>
                    <button className="header-btn" onClick={() => navigate('/')}>Logout</button>
                </nav>
            </div>
        </header>
    );
}

export default Header;