/**
 * Health Controller
 * Handles health check endpoints
 */

export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Aurevia Health API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
};

