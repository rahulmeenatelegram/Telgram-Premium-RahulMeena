import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`API Request: ${req.method} ${req.url}`);

  try {
    const url = req.url || '';
    const path = url.split('?')[0];
    
    console.log(`Processing path: ${path}`);

    // Handle channels route - return mock data for now
    if (path === '/channels' || path.endsWith('/channels')) {
      console.log("✅ Channels route matched");
      
      const mockChannels = [
        {
          id: 1,
          name: "Premium Tech Channel",
          slug: "premium-tech",
          description: "Latest tech news and insights",
          icon: "🚀",
          price: 99,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "Crypto Updates",
          slug: "crypto-updates",
          description: "Real-time cryptocurrency updates",
          icon: "₿",
          price: 149,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      console.log("✅ Returning mock channels:", mockChannels.length);
      res.status(200).json(mockChannels);
      return;
    }

    // Handle test route
    if (path === '/test' || path.endsWith('/test')) {
      console.log("✅ Test route matched");
      res.status(200).json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        path: path
      });
      return;
    }

    // Default response for any other route
    console.log("✅ Default response");
    res.status(200).json({ 
      message: 'API handler is working',
      path: path,
      url: url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}