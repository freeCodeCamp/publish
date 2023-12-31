# Creating multi-stage build for production
FROM node:18-alpine AS base
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat

FROM base as prune
COPY . .
# Install the version of turbo that is specified in package.json
RUN apk add --no-cache jq
RUN npm i -g turbo@$(jq -r .devDependencies.turbo package.json)
# Since prune --docker provides a truncated package-lock, we cannot use npm ci.
RUN turbo prune cron --docker

FROM base AS install
COPY --from=prune /app/out/json/ .
# Workaround for the fact the prepare script will try to run husky (which doesn't exist in production)
RUN npm pkg delete scripts.prepare
RUN npm install --omit=dev

FROM base as build
# First install dependencies (as they change less often)
COPY --from=prune /app/out/json/ .
RUN npm install
COPY --from=prune /app/out/full .
# Force use of installed turbo
RUN npx -no turbo run build --filter=cron...
# Remove all node_modules folders so we can copy the entire output of this
# stage. The depedencies are copied from the install stage.
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Creating final production image
FROM base AS runner
# Run the app in production mode
ENV NODE_ENV=production
COPY --from=install --chown=node:node /app .
COPY --from=build --chown=node:node /app .
USER node
EXPOSE 1337
WORKDIR /app/apps/cron
CMD ["npm", "run", "start"]
