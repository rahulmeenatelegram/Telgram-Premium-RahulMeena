import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    console.log(`API Request: ${req.method} ${req.url}`);

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
        },
        {
          id: 3,
          name: "Business Insights",
          slug: "business-insights",
          description: "Professional business analysis and market trends",
          icon: "📊",
          price: 199,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
      
      console.log("✅ Returning mock channels:", mockChannels.length);
      return res.status(200).json(mockChannels);
    }

    // Handle test route
    if (path === '/test' || path.endsWith('/test')) {
      console.log("✅ Test route matched");
      return res.status(200).json({
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        path: path
      });
    }

    // Default response for any other route
    console.log("✅ Default response");
    return res.status(200).json({ 
      message: 'API handler is working',
      path: path,
      url: url,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Handler Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}