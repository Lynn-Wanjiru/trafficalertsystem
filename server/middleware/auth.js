module.exports = (roles) => (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });
  if (roles && !roles.includes(req.session.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  req.user = req.session.user;
  next();
};
