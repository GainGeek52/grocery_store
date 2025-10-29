exports.ensureAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  res.redirect('/auth/login');
};

exports.ensureAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) return next();
  res.redirect('/admin/login');
};
