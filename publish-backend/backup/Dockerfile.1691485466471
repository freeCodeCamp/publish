FROM node:18-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY . .
RUN chown -R node:node /opt/app
USER node
# Builds the administration panel
RUN ["npm", "run", "build"]
EXPOSE 1337
# import config from `config/sync/*` files to database
CMD ["npm", "run", "cs", "import"]
# Start a Strapi application with autoReload enabled
CMD ["npm", "run", "develop"]
