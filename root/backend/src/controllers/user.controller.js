module.exports = (req, res) => {
  res.json({
    message: 'User data: Welcome, User!',
    user: req.user 
  });
};
