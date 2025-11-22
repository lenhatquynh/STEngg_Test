
FROM node:22-alpine AS base

# Build stage
FROM base AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /STEngg_Test_UI
ARG NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_API_HOST=$NEXT_PUBLIC_API_HOST

COPY ./STEngg_Test_UI/yarn.lock .
COPY ./STEngg_Test_UI/package.json .

ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn install --frozen-lockfile

COPY ./STEngg_Test_UI .

RUN yarn build

# Production stage
FROM base AS runner

USER node
WORKDIR /STEngg_Test_UI-prod

# Copy only production files
COPY --chown=node:node --from=builder /STEngg_Test_UI/.next/standalone ./
COPY --chown=node:node --from=builder /STEngg_Test_UI/.next/static ./.next/static
COPY --chown=node:node --from=builder /STEngg_Test_UI/public ./public

# Set the generated html files' "modified" date to a really old date
# So that nextjs will do the revalidation when the server starts 
RUN find ./.next/server/app -exec touch --date="1970-01-01" {} +

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "server.js"]