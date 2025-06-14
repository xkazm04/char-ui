FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy configuration files first for better caching
COPY tsconfig.json ./
COPY next.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Copy all source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Debug: Verify path alias configuration
RUN echo "=== Checking tsconfig.json ===" && cat tsconfig.json
RUN echo "=== Checking next.config.ts ===" && cat next.config.ts

# Debug: Check directory structure
RUN echo "=== Directory structure ===" && find app/ -type f -name "*.ts" -o -name "*.tsx" | head -20

# Install missing PostCSS dependencies explicitly
RUN npm install --save-dev @tailwindcss/postcss postcss autoprefixer

# Build the application with detailed error output
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy package.json for runtime
COPY --from=builder /app/package.json ./package.json

# Copy configuration files
COPY --from=builder /app/next.config.* ./

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public folder if it exists
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]