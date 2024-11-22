import React, { useState } from 'react';
import './Catalogue.css';
import logo from './LoOhmWh.png';


function Catalogue() {
    const [tableData, setTableData] = useState([
        { id: 1, image: 'https://rvb-img.reverb.com/image/upload/s--C7JzeXMR--/a_0/f_auto,t_large/v1731262020/tekxwhvplq5fh7aaqcc5.jpg', name: 'Fender 1991 Twin Reverb 2x12"', description: 'Reissue twin reverb, barely used. Open to rent or purchase.', price: '$900', category: 'Amps', location: 'Gainesville, FL' },
        { id: 2, image: 'https://rvb-img.reverb.com/image/upload/s--cKnuSASl--/a_0/f_auto,t_large/v1717098650/xoalq6wxzrvqpht3wvw4.jpg',  name: 'B.C. Rich Mockingbird 4-String', description: '\'79, full electronics.', price: '$2300', category: 'Guitars', location: 'Gainesville, FL'  },
        { id: 3, image: 'https://rvb-img.reverb.com/image/upload/s--vJCYEBJg--/a_0/f_auto,t_large/v1729550801/v6wctrrrliwkfyd181gr.jpg',  name: 'DigiTech Whammy Octave Pedal', description: 'Full pitch shifting. Good condition. Rent only.', price: '$240', category: 'Effect Pedals', location: 'Gainesville, FL'  },       
      ]);

      const [sortConfig, setSortConfig] = useState({ 
        key: null, 
        direction: 'ascending' 
      });
    
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
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="product-image"
                  />
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