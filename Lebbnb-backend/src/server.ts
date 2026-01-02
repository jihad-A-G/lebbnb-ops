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

    // Increase server timeout to 10 minutes for large file uploads
    server.timeout = 600000; // 10 minutes in milliseconds
    server.keepAliveTimeout = 610000; // Slightly higher than timeout
    server.headersTimeout = 620000; // Slightly higher than keepAliveTimeout
    
    console.log('⏱️  Server timeouts configured: 10 minutes for uploads');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
