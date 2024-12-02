import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./Products.css";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Please login.");
      return;
    }

    axios
      .get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => setProducts(data))
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("Unauthorized. Please login.");
        } else {
          toast.error("Failed to fetch products.");
        }
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="products-container">
      <div className="products-grid glass-box">
        <div className="products-header">
          <h1 className="products-title">Products</h1>
          <input
            type="text"
            className="products-search-input"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="products-card">
              <Link to={`/products/${product.id}`} className="products-link">
                <div className="product-name">{product.name}</div>
                <div className="product-price">${product.price}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
