# Builder stage
FROM --platform=linux/x86_64 node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install \
    && npm run build 

# Production stage
FROM --platform=linux/x86_64 node:18 as production
WORKDIR /app
COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.env /app/.env

# Install puppeteer browser
# Update apt-get and install Chromium
RUN apt-get update && apt-get install -y chromium \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE 8080

CMD [ "node", "./build/lib/index.js" ]
