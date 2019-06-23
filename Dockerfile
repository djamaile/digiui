# base image
FROM node:10.9.0

# set working directory
RUN mkdir /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV production

COPY . /app/
RUN npm install

RUN npm install -g serve
RUN npm rebuild node-sass --force
RUN npm run build

# start app
WORKDIR /app
# start app
CMD ["serve", "-s", "build"]

EXPOSE 5000