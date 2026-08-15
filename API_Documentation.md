# LeetCode Clone - API Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:3000`  
**Authentication**: JWT via HTTP-only cookies  

---

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
3. [Request/Response Examples](#requestresponse-examples)
4. [Error Handling](#error-handling)
5. [Guard & Authorization](#guard--authorization)
6. [Data Types & Schemas](#data-types--schemas)
7. [Postman Collection Import](#postman-collection-import)

---

## Authentication

### Cookie-Based JWT Authentication

The API uses **three tokens** stored as HTTP-only cookies:

| Token | Purpose | TTL | Secure |
|-------|---------|-----|--------|
| `access-token` | Short-lived JWT for API requests | 1 hour | HTTP-only ✓ |
| `refresh-token` | Long-lived token to refresh access | 7 days | HTTP-only ✓ |
| `session-token` | Session-specific validation token | Session | HTTP-only ✓ |

### Sign In Flow

**POST** `/auth/login`

**Request Body**:
```typescript
{
  email: string;        // Valid email format (required)
  password: string;     // Min 8 characters (required)
}
```

**Response** (200 OK):
```typescript
{
  status: "Success";
  data: {
    user: {
      _id: ObjectId;
      username: string;
      email: string;
      roles: Role[];
    };
    tokens: {
      accesstoken: string;        // JWT (1h)
      refreshtoken: string;       // Refresh JWT (7d)
      sessiontoken: string;       // Session token
    };
  };
}
```

**Cookies Set**:
```
Set-Cookie: access-token=<jwt>; HttpOnly; Secure; SameSite=Lax
Set-Cookie: refresh-token=<jwt>; HttpOnly; Secure; SameSite=Lax
Set-Cookie: session-token=<token>; HttpOnly; Secure; SameSite=Lax
```

### Token Refresh

**POST** `/auth/refresh`

Requires valid `refresh-token` in cookies. Returns new `access-token`.

**Response** (200 OK):
```typescript
{
  status: "Success";
  data: {
    accesstoken: string;  // New JWT token
  };
}
```

---

## API Endpoints

### 1. App Module

#### Health Check
```
GET /
```
Returns: `"Hello from NestJS"` (string)

---

### 2. Authentication Module

All endpoints return responses in standard format.

#### Sign In
```
POST /auth/login
Headers: Content-Type: application/json
Body: { email, password }
```

#### Sign Out
```
POST /auth/logout
Headers: (Cookies auto-included)
```

#### Refresh Token
```
POST /auth/refresh
Headers: (Cookies auto-included)
```

#### Validate Session
```
POST /auth/session/validation
Headers: (Cookies auto-included)
Response: { isExpired: boolean, user?: string }
```

---

### 3. Users Module

**Guards**: `AuthGuard`, `SessionGuard` on protected endpoints

#### Get All Users
```
GET /users/
Response: User[]
```

#### Get User by ID
```
GET /users/:id
Params: id (ObjectId)
Guards: AuthGuard, SessionGuard
Response: User
```

#### Create User
```
POST /users/createUser
Headers: Content-Type: application/json
Body: CreateUserDto {
  username: string;                        // Min 5 chars
  email: string;                          // Valid email
  password: string;                       // Min 8 chars
  favoriteProgrammingLanguage: number;    // Judge0 language ID
  roles?: Role[];                         // Optional
}
Response: SuccessResponse<User>
```

#### Update User
```
PATCH /users/:id
Params: id (ObjectId)
Headers: Content-Type: application/json
Body: Partial<UpdateUserDto>
Guards: AuthGuard, SessionGuard
Response: SuccessResponse<User>
```

#### Add Submission to User
```
PATCH /users/:id/submission
Params: id (ObjectId)
Headers: Content-Type: application/json
Body: { submissionId: string }
Guards: AuthGuard, SessionGuard
Response: SuccessResponse
```

#### Delete User
```
DELETE /users/:id/:userId
Params: id, userId (ObjectId)
Guards: AuthGuard, SessionGuard, RolesGuard (ADMIN)
Response: SuccessResponse
```

---

### 4. Problems Module

**Guards**: Various endpoints require `AuthGuard`, `RolesGuard`, `SessionGuard`

#### Create Problem
```
POST /problems/createProblem/:userId
Params: userId (ObjectId)
Headers: Content-Type: application/json
Body: CreateProblemDto {
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];   // { input, output }[]
  starterCode: CodeSnippet[]; // { language, code }[]
  status?: 'draft' | 'published';
}
Guards: AuthGuard, RolesGuard (ADMIN), SessionGuard
Response: SuccessResponse
```

#### Get All Problems
```
GET /problems?page=1&limit=10
Query:
  page: number (default: 1)
  limit: number (default: 10)
Response: SuccessResponse<{ problems: Problem[]; total: number; page: number; limit: number; totalPages: number }>
```

#### Search Problems with Filters
```
GET /problems/search/filters
Query:
  query?: string
  difficulty?: string
  page: number (default: 1)
  limit: number (default: 10)
Response: SuccessResponse<{ results: Problem[]; total: number }>
```

#### Get Problem by ID
```
GET /problems/:id
Params: id (ObjectId)
Response: Problem
```

#### Update Problem
```
PATCH /problems/:id/:userId
Params: id, userId (ObjectId)
Headers: Content-Type: application/json
Body: Partial<UpdateProblemDto>
Guards: AuthGuard, RolesGuard (ADMIN), SessionGuard
Response: SuccessResponse<Problem>
```

#### Delete Problem
```
DELETE /problems/:id/:userId
Params: id, userId (ObjectId)
Guards: AuthGuard, RolesGuard (ADMIN), SessionGuard
Response: SuccessResponse
```

---

### 5. Submissions Module

**Base Path**: `/` (root)  
**Guards**: All endpoints require `AuthGuard`, `SessionGuard`

#### Create Single Submission
```
POST /users/:userId/submissions
Params: userId (ObjectId)
Headers: Content-Type: application/json
Body: CreateSubmissionDto {
  userId: ObjectId;
  problemId: ObjectId;
  status: 'PENDING' | 'ACCEPTED' | 'WRONG_ANSWER';
  language_id: number;      // Judge0 language ID
  source_code: string;      // User's code
  stdin: string;           // Input for execution
  expected_output?: string;
  executionTime?: number;   // Milliseconds
  memoryUsed?: number;      // Kilobytes
  submittedAt?: Date;
  actual_output?: string;
}
Response: SuccessResponse<Submission>
```

#### Create Batch Submissions
```
POST /users/:userId/submissions/batch
Params: userId (ObjectId)
Headers: Content-Type: application/json
Body: {
  submissions: CreateSubmissionDto[]
}
Response: SuccessResponse<Submission[]>
```

#### Get Submission by ID
```
GET /users/:userId/submissions/:id
Params: userId, id (ObjectId)
Response: SuccessResponse<Submission>
```

#### Update Submission Status
```
PUT /users/:userId/submissions/:id
Params: userId, id (ObjectId)
Headers: Content-Type: application/json
Body: Partial<UpdateSubmissionDTO> {
  status?: string;
  executionTime?: number;
  memoryUsed?: number;
  actual_output?: string;
}
Response: SuccessResponse<Submission>
```

#### Batch Update Submissions
```
PUT /batchupdate/submission
Headers: Content-Type: application/json
Body: UpdateSubmissionDTO[]
Response: SuccessResponse
```

#### Get Problem Submissions
```
GET /users/:userId/problems/:problemId
Params: userId, problemId (ObjectId)
Response: SuccessResponse<Submission[]>
```

#### Get User Submissions - Paginated
```
GET /users/:userId/submissions
Params: userId (ObjectId)
Query:
  page: number (default: 1)
  limit: number (default: 20)
  status?: 'ACCEPTED' | 'WRONG_ANSWER'
  problemId?: ObjectId
  languageId?: number
  sortBy?: string (default: 'submittedAt')
  sortOrder?: 'asc' | 'desc' (default: 'desc')
Response: {
  success: boolean;
  data: Submission[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
  stats: {
    total: number;
    accepted: number;
    rejected: number;
  };
}
```

---

### 6. User Stats Module

**Base Path**: `/user-stats`  
**Guards**: All endpoints require `AuthGuard`, `SessionGuard`

#### Create User Stats
```
POST /user-stats/create
Headers: Content-Type: application/json
Body: { userId: ObjectId }
Response: SuccessResponse
```

#### Get User Stats
```
GET /user-stats/:userId
Params: userId (ObjectId)
Response: SuccessResponse<UserStat> {
  _id: ObjectId;
  userId: ObjectId;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  rank: number;
  previousRank?: number;
  isOnline: boolean;
}
```

#### Update User Stats
```
PUT /user-stats/:userId
Params: userId (ObjectId)
Headers: Content-Type: application/json
Body: UpdateUserStatDTO {
  difficult: 'easy' | 'medium' | 'hard';
  problemId: ObjectId;
}
Response: SuccessResponse
```

#### Update Online Status
```
PATCH /user-stats/:userId/online-status
Params: userId (ObjectId)
Headers: Content-Type: application/json
Body: { isOnline: boolean }
Response: SuccessResponse
```

---

### 7. Leaderboard Cache Module

**Base Path**: `/leaderboard`  
**Async Processing**: Uses BullMQ for long-running operations

#### Get Leaderboard - Paginated
```
GET /leaderboard/paginated
Query:
  page: number (default: 1)
  limit: number (default: 50)
Guards: AuthGuard, SessionGuard
Response: SuccessResponse {
  users: LeaderboardUser[];  // With rank, points, solved counts
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    pageSize: number;
  };
}
```

**LeaderboardUser Schema**:
```typescript
{
  _id: ObjectId;
  userId: {
    _id: ObjectId;
    username: string;
    email: string;
  };
  rank: number;
  previousRank?: number;
  totalPoints: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  isOnline: boolean;
}
```

#### Refresh Leaderboard Cache
```
POST /leaderboard/refresh
Guards: AuthGuard, SessionGuard
Response: { jobId: string }  // BullMQ job ID
```

#### Recalculate Ranks
```
POST /leaderboard/recalculate
Guards: AuthGuard, SessionGuard
Response: { jobId: string }  // For tracking progress
```

#### Create Leaderboard Cache
```
POST /leaderboard/create
Guards: AuthGuard, SessionGuard
Response: SuccessResponse
```

#### Get User Position
```
GET /leaderboard/user/:userId/position
Params: userId (ObjectId)
Response: SuccessResponse {
  ranked: boolean;
  currentRank?: number;
  totalPoints: number;
  totalSolved: number;
  totalRankedUsers: number;
  percentile: string;
}
```

#### Search Users - Filters
```
GET /leaderboard/filters
Query:
  userName?: string       // Search filter
  period?: string
  page?: number (default: 1)
  limit?: number (default: 50)
Response: SuccessResponse<{ users: LeaderboardUser[]; pagination: {...} }>
```

#### Leaderboard SSE Events
```
GET /leaderboard/events
Response: Server-Sent Events stream emitting leaderboard:update payloads
```

---

## Request/Response Examples

### Example 1: Complete Sign In Flow

**1. Sign In**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

**Response**:
```json
{
  "status": "Success",
  "data": {
    "user": {
      "_id": "64b7c2f5e4b0a2a1b2c3d4e5",
      "username": "john_doe",
      "email": "john.doe@example.com",
      "roles": ["user"]
    },
    "tokens": {
      "accesstoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "sessiontoken": "session-token-value"
    }
  }
}
```

**Cookies Set**:
```
Set-Cookie: access-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax;
Set-Cookie: refresh-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Lax;
Set-Cookie: session-token=session-token-value; HttpOnly; Secure; SameSite=Lax;
```

---

### Example 2: Submit Code & Get Results

**1. Submit Code**
```bash
curl -X POST http://localhost:3000/users/64b7c2f5e4b0a2a1b2c3d4e5/submissions \
  -H "Content-Type: application/json" \
  -b "access-token=<token>; session-token=<token>" \
  -d '{
    "userId": "64b7c2f5e4b0a2a1b2c3d4e5",
    "problemId": "64b7c2f5e4b0a2a1b2c3d4e6",
    "status": "PENDING",
    "language_id": 93,
    "source_code": "def twoSum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []",
    "stdin": "[2, 7, 11, 15]\n9",
    "expected_output": "[0, 1]"
  }'
```

**Response** (201 Created):
```json
{
  "status": "Success",
  "data": {
    "_id": "64b7c2f5e4b0a2a1b2c3d4e7",
    "userId": "64b7c2f5e4b0a2a1b2c3d4e5",
    "problemId": "64b7c2f5e4b0a2a1b2c3d4e6",
    "status": "PENDING",
    "language_id": 93,
    "source_code": "...",
    "judge0Token": "ed64e0a6-abcd-4def-1234-567890abcdef",
    "submittedAt": "2024-07-26T12:34:56.789Z"
  }
}
```

**2. Check Status** (Poll this endpoint)
```bash
curl -X GET http://localhost:3000/users/64b7c2f5e4b0a2a1b2c3d4e5/submissions/64b7c2f5e4b0a2a1b2c3d4e7 \
  -b "access-token=<token>; session-token=<token>"
```

**Response** (After Judge0 processes):
```json
{
  "status": "Success",
  "data": {
    "_id": "64b7c2f5e4b0a2a1b2c3d4e7",
    "status": "ACCEPTED",
    "executionTime": 45,
    "memoryUsed": 512,
    "actual_output": "[0, 1]",
    "judge0Token": "ed64e0a6-abcd-4def-1234-567890abcdef"
  }
}
```

---

### Example 3: Get Leaderboard

```bash
curl -X GET "http://localhost:3000/leaderboard/paginated?page=1&limit=20" \
  -b "access-token=<token>; session-token=<token>"
```

**Response**:
```json
{
  "status": "Success",
  "data": {
    "users": [
      {
        "_id": "64b7c2f5e4b0a2a1b2c3d4f1",
        "userId": {
          "_id": "64b7c2f5e4b0a2a1b2c3d4e5",
          "username": "john_doe",
          "email": "john.doe@example.com"
        },
        "rank": 1,
        "previousRank": 2,
        "totalPoints": 1500,
        "easySolved": 10,
        "mediumSolved": 5,
        "hardSolved": 2,
        "isOnline": true
      },
      {
        "_id": "64b7c2f5e4b0a2a1b2c3d4f2",
        "userId": {
          "_id": "64b7c2f5e4b0a2a1b2c3d4e6",
          "username": "jane_smith",
          "email": "jane.smith@example.com"
        },
        "rank": 2,
        "previousRank": 1,
        "totalPoints": 1400,
        "easySolved": 9,
        "mediumSolved": 4,
        "hardSolved": 2,
        "isOnline": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 100,
      "pageSize": 20
    }
  }
}
```

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "status": "Failure",
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2024-07-26T12:34:56.789Z"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid DTO, validation error |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Insufficient permissions/roles |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, etc. |
| 500 | Server Error | Unexpected error |

### Example Error Response

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "short"
  }'
```

**Response** (400 Bad Request):
```json
{
  "status": "Failure",
  "error": {
    "message": "Validation error: email must be a valid email address, password must be at least 8 characters",
    "statusCode": 400,
    "timestamp": "2024-07-26T12:34:56.789Z"
  }
}
```

---

## Guard & Authorization

### Auth Guards Flow

```
HTTP Request
    ↓
[AuthGuard] - Validates JWT from cookies
    ↓ (Sets request.user)
[SessionGuard] - Validates session token
    ↓ (Sets request.user = userId)
[RolesGuard] - Checks user roles
    ↓
If all guards pass → Controller method executes
If any guard fails → 401/403 response
```

### Guard Details

| Guard | Purpose | Cookie | Validates |
|-------|---------|--------|-----------|
| `AuthGuard` | JWT validation | `access-token` | JWT signature, expiry |
| `SessionGuard` | Session validation | `session-token` | Session token existence |
| `RolesGuard` | Role-based access | N/A | User roles vs @Roles() decorator |

### Protected Endpoints Example

```typescript
@UseGuards(AuthGuard, SessionGuard, RolesGuard)
@Roles(Role.Admin)
@Delete('/problems/:id/:userId')
deleteProblem(@Param('id') id: string) {
  // Only admins can reach here
}
```

---

## Data Types & Schemas

### Common Types

```typescript
// User Role Enum
enum Role {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator'
}

// Submission Status
type SubmissionStatus = 'PENDING' | 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | 'TIME_LIMIT_EXCEEDED';

// Problem Difficulty
type Difficulty = 'easy' | 'medium' | 'hard';

// Judge0 Language IDs (Sample)
{
  53: 'C++',
  54: 'C#',
  71: 'Python',
  93: 'Python (3.11)',
  63: 'JavaScript'
}
```

### Response Wrapper

```typescript
interface SuccessResponse<T = any> {
  status: 'Success';
  data: T;
  message?: string;
}

interface FailureResponse {
  status: 'Failure';
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
  };
}
```

### Pagination

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
}
```

---

## Postman Collection Import

### Method 1: Import JSON File

1. Open Postman
2. Click **"Import"** (top left)
3. Select **"Upload Files"** tab
4. Choose `Postman_Collection.json`
5. Click **"Import"**

### Method 2: Set Environment Variables

Create a Postman environment with:

```json
{
  "baseUrl": "http://localhost:3000",
  "accessToken": "",
  "refreshToken": "",
  "sessionToken": "",
  "userId": "64b7c2f5e4b0a2a1b2c3d4e5",
  "problemId": "64b7c2f5e4b0a2a1b2c3d4e6",
  "submissionId": "64b7c2f5e4b0a2a1b2c3d4e7"
}
```

### Method 3: Pre-Request Scripts

The Sign In endpoint includes a test script that automatically extracts and saves tokens:

```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set('accessToken', jsonData.data.tokens.accesstoken);
  pm.environment.set('refreshToken', jsonData.data.tokens.refreshtoken);
  pm.environment.set('sessionToken', jsonData.data.tokens.sessiontoken);
}
```

---

## Workflow Examples

### Typical User Journey

```
1. Sign In
   POST /auth/login
   ↓
2. Get Problems
   GET /problems
   ↓
3. Submit Code
   POST /users/:userId/submissions
   ↓
4. Poll for Results
   GET /users/:userId/submissions/:submissionId (repeat until status ≠ PENDING)
   ↓
5. Check Leaderboard
   GET /leaderboard/paginated
```

### Admin Workflow

```
1. Sign In (as admin)
   POST /auth/login
   ↓
2. Create Problem
   POST /problems/createProblem/:userId (requires ADMIN role)
   ↓
3. Recalculate Ranks
   POST /leaderboard/recalculate
   ↓
4. Monitor Leaderboard Update
   GET /leaderboard/paginated
```

---

## Rate Limiting & Performance

- **Leaderboard Jobs**: 10 jobs/min (via BullMQ)
- **Batch Submissions**: Max 100 submissions per batch
- **Pagination**: Max 100 results per page
- **Search Filtering**: Indexed on `username`, `email`

---

## Configuration

**Environment Variables** (`.env` required):

```env
MONGODB_CONNECTION_STRING=mongodb+srv://user:pass@cluster.mongodb.net/leetcode
JWT_SECRET=your-jwt-secret-key
REDIS_URL=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
FRONTEND_ORIGIN=http://localhost:5173
JUDGE0_API_KEY=your-judge0-api-key
JUDGE0_HOST=judge0-api.com
```

---

**Last Updated**: March 2026  
**Collection Version**: 1.0  
**Total Endpoints**: 31
