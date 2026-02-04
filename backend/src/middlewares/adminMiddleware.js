export function adminOnly(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso permitido apenas para admin' });
  }
  next();
}