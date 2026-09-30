FROM node:20-slim
WORKDIR /usr/app

# Install dependencies and build the project.
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

# Run the web service on container startup.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
