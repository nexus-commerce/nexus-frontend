FROM node:18-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VUE_APP_API_BASE_URL
ARG VUE_APP_STRIPE_PUBLISHABLE_KEY
ARG VUE_APP_DEBUG

ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL
ENV VUE_APP_STRIPE_PUBLISHABLE_KEY=$VUE_APP_STRIPE_PUBLISHABLE_KEY
ENV VUE_APP_DEBUG=$VUE_APP_DEBUG

RUN npm run build

FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

