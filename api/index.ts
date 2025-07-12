// A simple Vercel Serverless Function for testing

export default function handler(req, res) {
  // This log will absolutely appear if the file is being executed
  console.log("🔥 The test API handler was reached successfully!");

  const responseData = { 
    message: "Hello from your test API!",
    url: req.url,
    time: new Date().toISOString()
  };

  res.status(200).json(responseData);
}