module.exports = (req, res) => {
  res.json({ message: 'Hello from API!', timestamp: new Date().toISOString() });
};
