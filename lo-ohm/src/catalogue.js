/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import './Catalogue.css';
import logo from './LoOhmWh.png';
import axios from 'axios';

function Catalogue() {
    const [tableData, setTableData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ 
        key: null, 
        direction: 'ascending' 
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch items from backend when component mounts
    useEffect(() => {
        const fetchItems = async () => {
            try {
                // First, get the item IDs and names
                const itemsResponse = await axios.get('http://localhost:5000/getitems');
                const itemNames = itemsResponse.data;

                // Then, get full item details
                const iaResponse = await axios.get('http://localhost:5000/getia');
                const itemDetails = iaResponse.data;
                console.log(itemDetails);
                // Transform the data into the format we need
                const formattedData = Object.entries(itemDetails).map(([id, details]) => ({
                    id: id,
                    username: details[0],
                    name: details[1],
                    description: details[2],
                    price: details[3],
                    location: details[4],
                    category: details[5], // Using tags as category
                    image: details[6],
                }));

                console.log("BOMB");
                console.log(formattedData.id);
                console.log(formattedData.username);
                
                setTableData(formattedData);
                setIsLoading(false);
                // eslint-disable-next-line no-restricted-globals
            } catch (err) {
                setError('Failed to fetch items');
                setIsLoading(false);
                console.error('Error fetching items:', err);
            }
            

        };

        fetchItems();
    }, []);

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="catalogue-container">
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
                        <button className="header-btn">Profile</button>
                        <button className="header-btn">Products</button>
                        <button className="header-btn">Categories</button>
                        <button className="header-btn">Cart</button>
                    </nav>
                </div>
            </header>
            <main className="catalogue-content">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th onClick={() => sortTable('id')}>
                                ID {sortConfig.key === 'id' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                            </th>
                            <th>Image</th>
                            <th onClick={() => sortTable('name')}>
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                            </th>
                            <th>Description</th>
                            <th onClick={() => sortTable('price')}>
                                Price {sortConfig.key === 'price' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                            </th>
                            <th onClick={() => sortTable('category')}>
                                Category {sortConfig.key === 'category' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                            </th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default Catalogue;