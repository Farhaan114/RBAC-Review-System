import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { Products } from './Products';
import { MyReviews } from './MyReviews';
import AdminsPage from './Admin';
import { ProductDetails } from './ProductDetails';
import { AuthProvider } from './AuthContext';
import { Navbar } from './Navbar';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}

const AppWrapper = () => {
  const location = useLocation(); // Get current route location
  const hideNavbarRoutes = ['/', '/register']; // Routes where Navbar should be hidden

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/myreviews" element={<MyReviews />} />
        <Route path="/admin" element={<AdminsPage />} />
        <Route path="/products/:productId" element={<ProductDetailsWrapper />} />
      </Routes>
    </>
  );
};

const ProductDetailsWrapper = () => {
  const { productId } = useParams(); // Extract productId from URL
  return <ProductDetails productId={productId} />;
};

export default App;
