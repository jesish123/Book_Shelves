const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "User identity not found",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Role '${req.user.role}' is not authorized to perform this action`,
      });
    }

    next(); // Access granted!
  };
};

export default authorizeRoles;