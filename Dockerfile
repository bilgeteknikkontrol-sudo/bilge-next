# ---- Çok aşamalı, hafif üretim imajı (Next.js standalone) ----
FROM node:20-alpine AS base
WORKDIR /app

# Bağımlılıkları ayrı katmanda kur
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Derle
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV STANDALONE=1
RUN npm run build

# Çalışma imajı
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
