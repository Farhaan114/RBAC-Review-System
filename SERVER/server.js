// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('./authenticateToken');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

// Middleware for role-based access
function checkRole(requiredRoles) {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

// Routes
// Registration
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertUserSql, [username, hashedPassword], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to register user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  const [results] = await db.promise().query(sql, [username]);

  if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

  const user = results[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token, userId: user.id, role: user.role });
});

// Role-based access: Admin
app.get('/api/admin', authenticateToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

// Role-based access: Moderator
app.get('/api/moderator', authenticateToken, checkRole(['moderator']), (req, res) => {
  res.json({ message: 'Welcome Moderator!' });
});

// Role-based access: User
app.get('/api/user', authenticateToken, checkRole(['user']), (req, res) => {
  res.json({ message: 'Welcome User!' });
});

// Protected route for all roles
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.role}!` });
});

//-- ROUTES -- 

// Show all products
app.get('/api/products', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products' });
    res.json(results);
  });
});

// Show details of a specific product
app.get('/api/products/:id', (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch product details' });
    if (results.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(results[0]);
  });
});

// Show reviews for a specific product
app.get('/api/products/:id/reviews', (req, res) => {
  const sql = `
    SELECT 
      r.id,  -- Include the review ID
      u.username, 
      r.created_at AS timestamp, 
      r.rating, 
      r.comment 
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch reviews' });
    res.json(results);
  });
});



// Show list of moderators (Admin only)
app.get('/api/moderators', authenticateToken, checkRole(['admin']), (req, res) => {
  const sql = 'SELECT id, username, role FROM users WHERE role = "moderator"';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch moderators' });
    res.json(results);
  });
});

// Show list of admins (Admin only)
app.get('/api/admins', authenticateToken, checkRole(['admin']), (req, res) => {
  const sql = 'SELECT id, username, role FROM users WHERE role = "admin"';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch admins' });
    res.json(results);
  });
});

// Post a review for a product
app.post('/api/products/:id/reviews', authenticateToken, checkRole(['user', 'moderator', 'admin']), (req, res) => {
  const { rating, comment } = req.body;
  const sqlCheck = 'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?';
  const sqlInsert = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
  db.query(sqlCheck, [req.user.id, req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to check review' });
    if (results.length > 0) return res.status(400).json({ error: 'You have already reviewed this product' });

    db.query(sqlInsert, [req.user.id, req.params.id, rating, comment], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to post review' });
      res.json({ message: 'Review added successfully' });
    });
  });
});

// Edit a review by a user
app.put('/api/reviews/:id', authenticateToken, (req, res) => {
  const { rating, comment } = req.body;
  const sql = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?';
  db.query(sql, [rating, comment, req.params.id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to edit review' });
    if (results.affectedRows === 0) return res.status(403).json({ error: 'You can only edit your own reviews' });
    res.json({ message: 'Review updated successfully' });
  });
});

// Remove a user's review
app.delete('/api/reviews/:id', authenticateToken, (req, res) => {
  const sql = 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
  db.query(sql, [req.params.id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to delete review' });
    if (results.affectedRows === 0) return res.status(403).json({ error: 'You can only delete your own reviews' });
    res.json({ message: 'Review deleted successfully' });
  });
});

//delete by mods and admins
app.delete('/api/reviews/:id/moderator', authenticateToken, checkRole(['moderator', 'admin']), (req, res) => {
  const reviewId = req.params.id;
  
  if (!reviewId) {
    console.log('Review ID is undefined or missing');
    return res.status(400).json({ error: 'Review ID is required' });
  }
  
  console.log('Review ID to delete:', reviewId);
  const sql = 'DELETE FROM reviews WHERE id = ?';
  db.query(sql, [reviewId], (err) => {
    if (err) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ error: 'Failed to delete review' });
    }
    res.json({ message: 'Review deleted successfully' });
  });
});



// Edit user privileges (Admin only)
app.put('/api/users/:id/role', authenticateToken, checkRole(['admin']), (req, res) => {
  const { role } = req.body;
  const sql = 'UPDATE users SET role = ? WHERE id = ?';
  db.query(sql, [role, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update user role' });
    res.json({ message: 'User role updated successfully' });
  });
});

// Delete a product (Admin only)
app.delete('/api/products/:id', authenticateToken, checkRole(['admin']), (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete product' });
    res.json({ message: 'Product deleted successfully' });
  });
});


// Get all reviews by the logged-in user
app.get('/api/reviews/me', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract userId from the authenticated token

  const sql = `
    SELECT r.id, r.rating, r.comment, r.created_at, r.updated_at, p.name AS product_name 
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    WHERE r.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }

    res.json({ reviews: results });
  });
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
