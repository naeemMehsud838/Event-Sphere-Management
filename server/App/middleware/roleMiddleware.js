// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: "Access denied",
//       });
//     }

//     next();
//   };
// };

// module.exports = authorizeRoles;

const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only",
    });
  }
  next();
};

module.exports = requireAdmin;