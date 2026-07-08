# ---- Build stage ----
FROM node:22-slim AS build
WORKDIR /app

# Install deps from lockfile (cached layer)
COPY package.json package-lock.json ./
RUN npm ci

# Build the standalone production bundle
COPY . .
# NEXT_PUBLIC_* vars are inlined at build time. The browser always calls the
# same-origin /api/backend/* path, so this stays constant across environments.
ENV NEXT_PUBLIC_BACKEND_BASE_URL=/api/backend
RUN npm run build

# ---- Runtime stage ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
# BACKEND_INTERNAL_URL is where the Next.js server proxies /api/backend/* at
# runtime. On a single EC2 with both containers it's the Flask container's
# service name/loopback; overridden by docker-compose.
ENV BACKEND_INTERNAL_URL=http://backend:3001
ENV PORT=3000

# Standalone output: server.js + the minimal node_modules it needs.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
