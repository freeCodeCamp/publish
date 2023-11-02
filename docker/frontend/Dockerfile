# Creating multi-stage build for production
FROM node:18-alpine AS base
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

FROM base as prune
COPY . .
# Install the version of turbo that is specified in package.json
RUN apk add --no-cache jq
RUN npm i -g turbo@$(jq -r .devDependencies.turbo package.json)
# Since prune --docker provides a truncated package-lock, we cannot use npm ci.
RUN turbo prune frontend --docker

FROM base as build
ARG NEXT_PUBLIC_STRAPI_BACKEND_URL=http://localhost:1337
ENV NEXT_PUBLIC_STRAPI_BACKEND_URL=$NEXT_PUBLIC_STRAPI_BACKEND_URL
# First install dependencies (as they change less often)
COPY --from=prune /app/out/json/ .
RUN npm install
COPY --from=prune /app/out/full .
# Force use of installed turbo
RUN npx -no turbo run build --filter=frontend...

# Creating final production image
FROM base AS runner
# Run the app in production mode
ENV NODE_ENV=production
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=build --chown=node:node /app/apps/frontend/.next/standalone ./
COPY --from=build /app/apps/frontend/public ./apps/frontend/public
COPY --from=build --chown=node:node /app/apps/frontend/.next/static ./apps/frontend/.next/static
USER node
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
WORKDIR /app/apps/frontend
CMD ["node", "server.js"]
