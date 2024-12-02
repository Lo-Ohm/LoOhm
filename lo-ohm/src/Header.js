import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './LoOhmWh.png';
import './Catalogue.css'


function Header() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const cartItems = response.data.cart || [];
                setCartCount(cartItems.length); // Set the cart count dynamically
            } catch (err) {
                console.error('Error fetching cart count:', err);
            }
        };

        fetchCartCount();
    }, []); // Fetch the cart count once when the component mounts

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
                    <button className="header-btn" onClick={() => navigate('/cart')}>
                        Cart ({cartCount}) {/* Display the cart count */}
                    </button>
                    <button className="header-btn" onClick={() => navigate('/')}>Logout</button>
                </nav>
            </div>
        </header>
    );
}

export default Header;
