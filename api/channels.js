module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`API Request: ${req.method} ${req.url}`);

  if (req.method === 'GET') {
    try {
      console.log("✅ [1] /api/channels handler invoked.");
      
      // Mock data to test if the API routing works
      const mockChannels = [
        {
          id: 1,
          name: "Test Channel 1",
          slug: "test-channel-1",
          description: "This is a test channel",
          icon: "🎯",
          price: 99,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "Test Channel 2", 
          slug: "test-channel-2",
          description: "Another test channel",
          icon: "🚀",
          price: 149,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      console.log("✅ [2] Returning mock channels:", mockChannels.length);
      
      res.status(200).json(mockChannels);
    } catch (error) {
      console.error("❌ [ERROR] Failed to fetch channels:", error);
      res.status(500).json({ 
        message: "Failed to fetch channels", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
