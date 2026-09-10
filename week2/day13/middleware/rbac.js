const permissions = {
  user: ['users:read'],
  moderator: ['users:read', 'users:write'],
  admin: [
    'users:read',
    'users:write',
    'users:delete'
  ]
};

function hasPermission(role, permission) {
  return (permissions[role] || []).includes(permission);
}

function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role || !hasPermission(role, permission)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Forbidden',
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
}

module.exports = {
  permissions,
  hasPermission,
  requirePermission
};