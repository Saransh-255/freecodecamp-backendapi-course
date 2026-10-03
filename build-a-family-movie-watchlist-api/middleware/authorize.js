const authorizeModification = (req, res, next) => {
  const { role, id } = req.user;
  const { userId } = req.params;

  // Parents have full access.
  if (role === 'parent') {
    return next();
  } 
  
  // Children only have access if the target userId matches their own id.
  if (role === 'child' && String(id) === String(userId)) {
    return next();
  }

  // Deny access if neither condition is met.
  return res.status(403).json({ error: "Access denied" });
};

export { authorizeModification };
