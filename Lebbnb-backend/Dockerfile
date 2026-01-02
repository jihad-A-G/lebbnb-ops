# ================================
# Build Stage
# ================================
FROM node:20-alpine AS builder

# Install build dependencies for Sharp (image processing library)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for building)
RUN npm ci && npm cache clean --force

# Copy TypeScript config, source code, and scripts
COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

# Build TypeScript
RUN npm run build

# ================================
# Production Stage
# ================================
FROM node:20-alpine

# Install runtime dependencies for Sharp
RUN apk add --no-cache vips

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy scripts for admin creation
COPY --from=builder /app/scripts ./scripts

# Create uploads directory with proper permissions
RUN mkdir -p uploads && \
    chown -R nodejs:nodejs uploads && \
    chmod 755 uploads

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]
