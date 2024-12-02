import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cart.css';
import Header from './Header'; // Import the Header component


function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            const cartIds = response.data.cart || [];
            if (cartIds.length > 0) {
                const itemDetailsResponse = await axios.get('http://localhost:5000/getia');
                const itemDetails = itemDetailsResponse.data;
    
                // Map each cart ID to its corresponding details, ensuring the image is included
                const items = cartIds.map((id) => ({
                    id,
                    name: itemDetails[id]?.[1] || 'Unknown Name', // Assuming itemDetails[id][1] is the name
                    description: itemDetails[id]?.[2] || 'No description available',
                    price: itemDetails[id]?.[3] || 'Price not available',
                    image: itemDetails[id]?.[6] || 'default-image.jpg', // Use the correct index for the image
                }));
    
                setCartItems(items);
            }
            setIsLoading(false);
        } catch (err) {
            setError('Failed to load cart items');
            setIsLoading(false);
            console.error('Error fetching cart:', err);
        }
    };
    

    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/cart/remove', 
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCartItems(cartItems.filter(item => item.id !== productId));
            alert('Item removed from cart');
        } catch (err) {
            console.error('Error removing item from cart:', err);
            alert('Failed to remove item from cart');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div>
                <Header /> 
                <div className="empty-cart-container">
                    <h2>Your Cart is Empty</h2>
                    <p>Add some products to your cart to see them here!</p>
                    <button className="go-to-catalogue-btn" onClick={() => navigate('/catalogue')}>
                        Go to Catalogue
                    </button>
                </div>
            </div>

        );
    }
    

    if (isLoading) {
        return <div>Loading your cart...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (cartItems.length === 0) {
        return <div>Your cart is empty. <button onClick={() => navigate('/catalogue')}>Go to Catalogue</button></div>;
    }

    return (
    <div>
        <Header /> 
        <div className="cart-container">
            <h1>Your Cart</h1>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <img 
                                    src={item.image || 'default-image.jpg'} 
                                    alt={item.name} 
                                    className="cart-item-image" 
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td>
                                <button 
                                    onClick={() => handleRemoveFromCart(item.id)} 
                                    className="remove-from-cart-btn"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/catalogue')} className="continue-shopping-btn">Continue Shopping</button>
        </div>
    </div>
    );
}

export default Cart;
