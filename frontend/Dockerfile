# ─── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ─── Runtime stage (standalone) ───────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Run as non-root (node user, uid 1000) — least privilege.
# ISR cache (.next/cache) must be writable by the runtime user.
RUN mkdir -p .next/cache && chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
