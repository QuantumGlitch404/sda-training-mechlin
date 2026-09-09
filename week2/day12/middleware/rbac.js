const { AppError } = require("./errorHandler");

const PERMISSIONS = {
  "users:read": ["admin", "moderator"],
  "users:write": ["admin"],
  "users:delete": ["admin"],

  "products:read": [
    "admin",
    "moderator",
    "user"
  ],

  "products:write": [
    "admin",
    "moderator"
  ],

  "products:delete": ["admin"],

  "orders:read": [
    "admin",
    "moderator",
    "user"
  ],

  "orders:write": [
    "admin",
    "moderator",
    "user"
  ],

  "orders:delete": ["admin"],

  "analytics:read": [
    "admin",
    "moderator"
  ],

  "analytics:write": ["admin"],

  "system:read": ["admin"],
  "system:write": ["admin"],
  "system:delete": ["admin"]
};

const hasPermission = (
  user,
  permission
) => {
  if (!user || !user.role) {
    return false;
  }

  const allowedRoles =
    PERMISSIONS[permission];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(
    user.role
  );
};

const requirePermission = (
  permission
) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    if (
      !hasPermission(
        req.user,
        permission
      )
    ) {
      return next(
        new AppError(
          "Insufficient permissions",
          403,
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
};

const requireAnyPermission = (
  ...permissions
) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    const allowed =
      permissions.some(
        (permission) =>
          hasPermission(
            req.user,
            permission
          )
      );

    if (!allowed) {
      return next(
        new AppError(
          "Insufficient permissions",
          403,
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
};

const requireAllPermissions = (
  ...permissions
) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    const allowed =
      permissions.every(
        (permission) =>
          hasPermission(
            req.user,
            permission
          )
      );

    if (!allowed) {
      return next(
        new AppError(
          "Insufficient permissions",
          403,
          "INSUFFICIENT_PERMISSIONS"
        )
      );
    }

    next();
  };
};

const requireOwnership = (
  resourceField = "userId"
) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    if (req.user.role === "admin") {
      return next();
    }

    const resourceUserId =
      req.params[resourceField] ||
      req.body[resourceField];

    if (
      resourceUserId &&
      resourceUserId !==
        req.user._id.toString()
    ) {
      return next(
        new AppError(
          "Access denied: insufficient permissions",
          403,
          "ACCESS_DENIED"
        )
      );
    }

    next();
  };
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "Authentication required",
          401,
          "AUTHENTICATION_REQUIRED"
        )
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Insufficient role permissions",
          403,
          "INSUFFICIENT_ROLE_PERMISSIONS"
        )
      );
    }

    next();
  };
};

module.exports = {
  PERMISSIONS,
  hasPermission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireOwnership,
  requireRole
};