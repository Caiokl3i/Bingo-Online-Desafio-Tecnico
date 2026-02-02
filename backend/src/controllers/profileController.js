export function profile(req, res) {
  res.json({
    message: 'Rota protegida',
    user: req.user
  });
}