FROM node:16-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install && npm config set registry https://registry.npmmirror.com

COPY . .

RUN npm run pro

FROM nginx:alpine

COPY --from=builder /app/dist ./disk

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
