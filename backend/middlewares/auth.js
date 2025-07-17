const jwt = require('jsonwebtoken');

const tokenAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    
    const token = authHeader.split(' ')[1];

   
    const decoded = jwt.verify(token, 'secretkey'); 

   
    req.user = {
      id: decoded.id,    
    
    };

    next(); 
  } catch (err) {
    console.error('Token auth failed:', err.message);
    res.status(401).json({ message: 'Unauthorized or Invalid token' });
  }
};

module.exports = {
  tokenAuth
};
