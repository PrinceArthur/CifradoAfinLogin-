FROM node:lts-alpine as build-step

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY package.json /app

# ENV NODE_OPTIONS=--max_old_space_size=4096

# RUN npm install

COPY . /app

RUN npm run build --prod

FROM nginx:stable-alpine as production-stage

COPY  --from=build-step /app/dist/cifrado-afin /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]