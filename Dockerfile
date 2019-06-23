# Docker file om front-end te hosten
FROM node:10.9.0

RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV production

COPY . /app/
RUN npm install

RUN npm install -g serve
RUN npm rebuild node-sass --force
RUN npm run build

WORKDIR /app
CMD ["serve", "-s", "build"]

EXPOSE 5000