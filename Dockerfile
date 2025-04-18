# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Install pnpm using the official installation script
RUN wget -qO- https://get.pnpm.io/install.sh | sh - && \
    export PATH="/root/.local/share/pnpm:$PATH" && \
    pnpm install --frozen-lockfile
COPY . .
RUN export PATH="/root/.local/share/pnpm:$PATH" && pnpm run build && npx prisma generate

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "build"]
