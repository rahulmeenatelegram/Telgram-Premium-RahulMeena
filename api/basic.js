module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ 
    message: 'Basic JS API working!',
    timestamp: new Date().toISOString()
  });
};
