FROM node:20-alpine AS deps
WORKDIR /app
COPY app/backend/package.json ./
RUN npm install --omit=dev

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY app/backend/package.json ./
COPY app/backend/src ./src
COPY data /data

ENV DATA_DIR=/data
EXPOSE 4000

CMD ["node", "src/server.js"]
