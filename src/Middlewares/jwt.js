const jwt = require('jsonwebtoken');

const generateToken = (userId, email, username) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      username,
      timestamp: Date.now() 
    }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    {
      expiresIn: '30d', // Changed to 30 days
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
