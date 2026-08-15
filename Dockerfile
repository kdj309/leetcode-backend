# Define build arguments
ARG NODE_ENV="local"
ARG FRONTEND_ORIGIN="http://localhost:5173"
ARG MONGODB_CONNECTION_STRING=""
ARG JWT_SECRET=""
ARG DOMAIN=""
ARG REDIS_HOST=""
ARG REDIS_PASSWORD=""
ARG REDIS_PORT="6379"
ARG JUDGEAPI_BASE_URL=""
ARG JUDGEAPI_API_KEY=""
ARG JUDGEAPI_HOST=""
ARG ELASTICSEARCH_NODE=""
ARG ELASTICSEARCH_USERNAME=""
ARG ELASTICSEARCH_PASSWORD=""

# Stage 1: Development
FROM node:20 AS development

# Use build arguments as environment variables
ENV NODE_ENV=$NODE_ENV
ENV FRONTEND_ORIGIN=$FRONTEND_ORIGIN
ENV MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING
ENV JWT_SECRET=$JWT_SECRET
ENV DOMAIN=$DOMAIN
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PASSWORD=$REDIS_PASSWORD
ENV REDIS_PORT=$REDIS_PORT
ENV JUDGEAPI_BASE_URL=$JUDGEAPI_BASE_URL
ENV JUDGEAPI_API_KEY=$JUDGEAPI_API_KEY
ENV JUDGEAPI_HOST=$JUDGEAPI_HOST
ENV ELASTICSEARCH_NODE=$ELASTICSEARCH_NODE
ENV ELASTICSEARCH_USERNAME=$ELASTICSEARCH_USERNAME
ENV ELASTICSEARCH_PASSWORD=$ELASTICSEARCH_PASSWORD

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY --chown=node:node . .

# Build the app
RUN npm run build

# Stage 2: Production
FROM node:20 AS production

ARG NODE_ENV="local"
ARG FRONTEND_ORIGIN="http://localhost:5173"
ARG MONGODB_CONNECTION_STRING=""
ARG JWT_SECRET=""
ARG DOMAIN=""
ARG REDIS_HOST=""
ARG REDIS_PASSWORD=""
ARG REDIS_PORT="6379"
ARG JUDGEAPI_BASE_URL=""
ARG JUDGEAPI_API_KEY=""
ARG JUDGEAPI_HOST=""
ARG ELASTICSEARCH_NODE=""
ARG ELASTICSEARCH_USERNAME=""
ARG ELASTICSEARCH_PASSWORD=""

# Use build arguments as environment variables
ENV NODE_ENV="production"
ENV FRONTEND_ORIGIN=$FRONTEND_ORIGIN
ENV MONGODB_CONNECTION_STRING=$MONGODB_CONNECTION_STRING
ENV JWT_SECRET=$JWT_SECRET
ENV DOMAIN=$DOMAIN
ENV REDIS_HOST=$REDIS_HOST
ENV REDIS_PASSWORD=$REDIS_PASSWORD
ENV REDIS_PORT=$REDIS_PORT
ENV JUDGEAPI_BASE_URL=$JUDGEAPI_BASE_URL
ENV JUDGEAPI_API_KEY=$JUDGEAPI_API_KEY
ENV JUDGEAPI_HOST=$JUDGEAPI_HOST
ENV ELASTICSEARCH_NODE=$ELASTICSEARCH_NODE
ENV ELASTICSEARCH_USERNAME=$ELASTICSEARCH_USERNAME
ENV ELASTICSEARCH_PASSWORD=$ELASTICSEARCH_PASSWORD

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files and node_modules from the development stage
COPY --chown=node:node --from=development /usr/src/app/dist ./dist
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# Copy the rest of the application source code
COPY --chown=node:node . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "dist/main"]