# LeetCode Clone Backend

This repository contains the backend for a LeetCode clone application with a similar interface. Users can log in and solve coding problems using the backend built using the NestJS framework to create a robust application. MongoDB is used as the database.

## Features
- User authentication and authorization
- Problem-solving interface
- Problem submission and evaluation
- User progress tracking

## Technologies Used
- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **MongoDB**: A NoSQL database for storing user data and coding problems.

## Setup

### Environment Variables
Create a `.env` file in the root directory and add the following environment variables:

```bash
MONGODB_CONNECTION_STRING=""
JWT_SECRET=""
DOMAIN=""
NODE_ENV="local"
FRONTEND_ORIGIN="http://localhost:5173"
```
## Run Locally

Clone the project

```bash
  git clone https://github.com/kdj309/leetcode-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

## Run Through Docker

Clone the project

```bash
  git clone https://github.com/kdj309/leetcode-backend
```

Build the image
```
docker build -t leetcode-backend .
```

Run the image
```
docker run -p 3000:3000 --env-file .env leetcode-backend
```


## Demo
[Live Application Link](https://leetcode-clone-liard.vercel.app/)
