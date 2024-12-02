import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import at the top
import './Catalogue.css';
import addsymbol from './OhmSA.png';
import axios from 'axios';
import Header from './Header';  // Add this import

function Catalogue() {
    const [tableData, setTableData] = useState([]);
    const [originalTableData, setOriginalTableData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ 
        key: null, 
        direction: 'ascending' 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        location: '',
        tags: '',
        image: ''
    });
    const [cart, setCart] = useState([]);


    const navigate = useNavigate();  // Add this line after your useState declarations

    // Fetch items from backend when component mounts
    useEffect(() => {
        fetchItems();
    }, []);

    // Search effect to filter items based on search term
    useEffect(() => {
        if (!searchTerm) {
            setTableData(originalTableData);
            return;
        }

        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const filteredData = originalTableData.filter(item => 
            item.name.toLowerCase().includes(lowercasedSearchTerm) ||
            item.location.toLowerCase().includes(lowercasedSearchTerm)
        );

        setTableData(filteredData);
    }, [searchTerm, originalTableData]);

    const fetchItems = async () => {
        try {
            // First, get the item IDs and names
            const itemsResponse = await axios.get('http://localhost:5000/getitems');
            const itemNames = itemsResponse.data;

            // Then, get full item details
            const iaResponse = await axios.get('http://localhost:5000/getia');
            const itemDetails = iaResponse.data;

            // Transform the data into the format we need
            const formattedData = Object.entries(itemDetails).map(([id, details]) => ({
                id: id,
                username: details[0],
                name: details[1],
                description: details[2],
                price: details[3],
                location: details[4],
                category: details[5], // Using tags as category
                image: details[6]
            }));

            setTableData(formattedData);
            setOriginalTableData(formattedData);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch items');
            setIsLoading(false);
            console.error('Error fetching items:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/usernameinfo', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        try {
            // You might want to get the username from a logged-in user context
            const itemToAdd = {
                username: data, // Replace with actual username
                ...newItem
            };

            await axios.post('http://localhost:5000/additem', itemToAdd);
            
            // Refresh the items list
            await fetchItems();

            // Close the modal and reset the form
            setIsModalOpen(false);
            setNewItem({
                name: '',
                description: '',
                price: '',
                location: '',
                tags: '',
                image: ''
            });
            // Reset search term
            setSearchTerm('');
        } catch (err) {
            console.error('Error adding item:', err);
            alert('Failed to add item');
        }
    };

    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
    
        const sortedData = [...tableData].sort((a, b) => {
          if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
          if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
          return 0;
        });
    
        setTableData(sortedData);
        setSortConfig({ key, direction });
    };

    const handleChatClick = () => {
        navigate('/chat');
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };


    const handleAddToCart = async (productId) => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.post(
              'http://localhost:5000/cart/add',
              { product_id: productId },
              { headers: { Authorization: `Bearer ${token}` } }
          );
  
          if (response.status === 200) {
              setCart(prevCart => [...prevCart, productId]);
              alert('Product added to cart');
          }
      } catch (err) {
          console.error('Error adding to cart:', err);
          alert('Failed to add product to cart');
      }
  };
  
  

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        
        <div className="catalogue-container">
            <Header />
            <main className="catalogue-content">
                {/* Add heading */}
                <h1 className="catalogue-title">Catalogue</h1>
                
                {/* Search Input */}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name or location"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <table className="product-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Actions</th> {/* Column for Add to Cart */}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((product) => (
                        <tr key={product.id}>
                            <td>{product.username}</td>
                            <td>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.location}</td>
                            <td>
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="add-to-cart-btn"
                                >
                                    Add to Cart
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

                {/* Show message when no results found */}
                {tableData.length === 0 && (
                    <div className="no-results">
                        No items found matching your search.
                    </div>
                )}
            </main>

            {/* Rest of the component remains the same */}
            <button 
                className="floating-add-button" 
                onClick={() => setIsModalOpen(true)}
            >
                <img src={addsymbol} height={20} alt="Add item"></img>
            </button>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Item</h2>
                        <form onSubmit={handleAddItem}>
                            <div className="form-group">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={newItem.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={newItem.location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Tags:</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={newItem.tags}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL:</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={newItem.image}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-submit">Add Item</button>
                                <button 
                                    type="button" 
                                    className="btn-cancel"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Catalogue;