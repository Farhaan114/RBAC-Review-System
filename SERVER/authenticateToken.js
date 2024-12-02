const jwt = require('jsonwebtoken');

// Replace 'your-secret-key' with your actual secret key
const SECRET_KEY = "dff6643a6c96477a465ecd45c83255d84820720bc603afe9766d3c7566996776d6ffed7f4eac89634a130814f8cfbcf758196954518de8fbd2b8c250e9d3214c";

function authenticateToken(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

    // If no token is provided, return an unauthorized error
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Access Denied: Invalid Token" });
        }

        // Attach the user information to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    });
}

module.exports = authenticateToken;
