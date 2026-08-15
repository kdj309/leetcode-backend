# LeetCode Clone Backend

This repository contains the backend for a LeetCode clone application with a similar interface. Users can log in, solve coding problems, and interact with leaderboard and submission services through a NestJS API.

## Features
- User authentication and authorization
- Problem management and problem-solving flow
- Code submission and evaluation integration
- Leaderboard ranking and caching
- Redis-backed queue processing

## Technologies Used
- **NestJS**: Backend framework for building scalable APIs
- **MongoDB**: Primary application database
- **Redis + BullMQ**: Queue and leaderboard cache processing
- **Judge0**: External code execution service
- **Elasticsearch**: Search support for problems

## Prerequisites
- Node.js 20+
- npm
- Docker (optional, for containerized runs)
- Access to MongoDB, Redis, Judge0, and Elasticsearch

## Environment Variables
Create a `.env` file in the backend root and add the variables below:

```bash
NODE_ENV="local"
FRONTEND_ORIGIN="http://localhost:5173"
MONGODB_CONNECTION_STRING="mongodb://localhost:27017/leetcode"
JWT_SECRET="your-jwt-secret"
DOMAIN=""

REDIS_HOST="localhost"
REDIS_PASSWORD=""
REDIS_PORT=6379

JUDGEAPI_BASE_URL="https://judge0-ce.p.rapidapi.com"
JUDGEAPI_API_KEY="your-api-key"
JUDGEAPI_HOST="judge0-ce.p.rapidapi.com"

ELASTICSEARCH_NODE="http://localhost:9200"
ELASTICSEARCH_USERNAME="elastic"
ELASTICSEARCH_PASSWORD="your-password"
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start:dev
```

The API will be available on `http://localhost:3000`.

## Run with Docker

Build the image:

```bash
docker build -t leetcode-backend .
```

Run the container with your environment file:

```bash
docker run --rm -p 3000:3000 --env-file .env leetcode-backend
```

If you want to build with explicit values instead of using `.env`, you can pass build arguments as well:

```bash
docker build \
  --build-arg MONGODB_CONNECTION_STRING="..." \
  --build-arg JWT_SECRET="..." \
  --build-arg REDIS_HOST="..." \
  -t leetcode-backend .
```

## Notes
- The backend expects Redis, MongoDB, Judge0, and Elasticsearch services to be reachable from the environment where the app runs.
- For local development, keep your `.env` values consistent with the frontend’s API base URL and CORS settings.

## Demo
[Live Application Link](https://leetcode-clone-liard.vercel.app/)
