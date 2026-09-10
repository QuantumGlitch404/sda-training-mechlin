function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Access token is required',
        code: 'AUTHENTICATION_REQUIRED'
      }
    });
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid authorization format',
        code: 'INVALID_AUTHORIZATION'
      }
    });
  }

  const token = authorization.substring(7);

  if (token !== 'demo-token') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid access token',
        code: 'INVALID_TOKEN'
      }
    });
  }

  req.user = {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };

  next();
}

module.exports = {
  authenticate
};