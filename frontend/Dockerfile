#stage 1
FROM teracy/angular-cli as angular-built
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install --silent
COPY . .
RUN ng build --prod

#stage 2
FROM nginx:alpine
COPY --from=angular-built /usr/src/app/dist/mean-first /usr/share/nginx/html
CMD [ "nginx", "-g", "daemon off;" ]
