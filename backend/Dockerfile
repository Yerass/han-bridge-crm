# ─── Build stage ──────────────────────────────────────────────
# Debian-based image: Prisma engines work out-of-the-box (OpenSSL 3),
# unlike alpine/musl where the schema engine fails to load.
FROM node:22-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# src is needed because `prisma db seed` (ts-node) imports shared seed logic from src/
COPY --from=builder /app/src ./src

EXPOSE 4000

# Apply migrations then start. (prisma is available via npx)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
