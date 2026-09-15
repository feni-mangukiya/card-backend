const requireAdminKey = (req, res, next) => {
  const adminKey = req.header('x-admin-key');
  const expectedKey = process.env.ADMIN_KEY;

  if (!expectedKey) {
    return res.status(500).json({
      success: false,
      message: 'Admin key is not configured.'
    });
  }

  if (!adminKey || adminKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized admin access.'
    });
  }

  next();
};

module.exports = { requireAdminKey };
