import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    // Increase server timeout to 15 minutes for large file uploads
    server.timeout = 900000; // 15 minutes in milliseconds
    server.keepAliveTimeout = 910000; // Slightly higher than timeout
    server.headersTimeout = 920000; // Slightly higher than keepAliveTimeout
    
    console.log('⏱️  Server timeouts configured: 15 minutes for uploads');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
