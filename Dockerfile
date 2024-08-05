FROM node:18-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    libx11 \
    libxcomposite \
    libxdamage \
    libxrandr \
    libxtst \
    libxi \
    libxkbcommon \
    libdrm \
    alsa-lib \
    gdk-pixbuf \
    pango \
    mesa-gl \
    fontconfig \
    ttf-dejavu

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

COPY ./package*.json ./

RUN npm install --no-optional && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
