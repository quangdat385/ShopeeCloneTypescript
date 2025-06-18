# --- Build Stage ---
FROM node:22.16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy build output to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]