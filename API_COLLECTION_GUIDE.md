# LeetCode Clone API Collection Guide

**Generated**: March 2026  
**Total Endpoints**: 31  
**Modules**: 7 (Auth, Users, Problems, Submissions, UserStats, Leaderboard, App)

---



### 1. **Postman_Collection.json** 
- **Purpose**: Complete Postman collection with all 31 endpoints
- **Usage**: Import directly into Postman application
- **Features**:
  - Pre-configured request bodies with DTO structures
  - Example responses for each endpoint
  - Automatic token management via test scripts
  - Environment variables for easy configuration
  - Authentication flow included

### 2. **API_Documentation.md**
- **Purpose**: Comprehensive API reference documentation
- **Content**:
  - Authentication flow explanation
  - All 31 endpoints with descriptions
  - Request/response examples
  - Query parameters documentation
  - Guard & authorization matrix
  - Error handling guide
  - Common workflows

### 3. **API_Types_Reference.ts**
- **Purpose**: TypeScript interfaces for type safety
- **Content**:
  - All DTOs and response types
  - Enums (Role, SubmissionStatus, Difficulty)
  - Judge0 integration types
  - Request/response mapping
  - Utility types for extracting endpoint types
  - Query parameter interfaces

---

## 🚀 Quick Start

### Step 1: Import Postman Collection

```bash
# Option A: Manual Import
1. Open Postman
2. Click Import (top left)
3. Upload Postman_Collection.json

# Option B: Command Line
# (If you have Postman CLI installed)
postman collection import Postman_Collection.json
```

### Step 2: Configure Environment

Create a new environment in Postman with:

```json
{
  "baseUrl": "http://localhost:3000",
  "userId": "64b7c2f5e4b0a2a1b2c3d4e5",
  "problemId": "64b7c2f5e4b0a2a1b2c3d4e6",
  "submissionId": "64b7c2f5e4b0a2a1b2c3d4e7",
  "accessToken": "",
  "refreshToken": "",
  "sessionToken": ""
}
```

### Step 3: Test Authentication

1. Select environment from dropdown
2. Navigate to `Authentication → Sign In`
3. Update test email/password if needed
4. Click **Send**
5. Tokens automatically save to environment variables

### Step 4: Explore Endpoints

- All endpoints organized by module (Auth, Users, Problems, etc.)
- Each endpoint includes documentation and example payloads
- Pre-request scripts set up authentication automatically

---

## 📊 Endpoint Summary

### By Module

| Module | Count | Key Endpoints |
|--------|-------|---------------|
| **App** | 1 | Health check |
| **Auth** | 4 | Login, Logout, Refresh, Validate |
| **Users** | 6 | CRUD operations, add submission |
| **Problems** | 5 | CRUD operations, manage test cases |
| **Submissions** | 7 | Create, update, batch operations, filtering |
| **User Stats** | 4 | Create, read, update, online status |
| **Leaderboard** | 3 | Get paginated, refresh, recalculate |
| **TOTAL** | **31** | |

### By HTTP Method

| Method | Count | Purpose |
|--------|-------|---------|
| GET | 11 | Retrieve data |
| POST | 10 | Create new resources |
| PUT | 3 | Update resources (full replace) |
| PATCH | 4 | Partially update resources |
| DELETE | 2 | Remove resources |

### By Authentication Level

| Level | Count | Examples |
|-------|-------|----------|
| Public | 4 | Get problems, get leaderboard filters |
| User | 19 | Submissions, user stats |
| Admin | 5 | Create/delete problems, delete users |
| System | 3 | Cache refresh, job monitoring |

---

## 🔐 Authentication Workflow

### Token Management

```
1. POST /auth/login
   ↓ Returns 3 tokens in cookies
   ├─ access-token (1 hour) → Use for API requests
   ├─ refresh-token (7 days) → Use to refresh access token
   └─ session-token → Use for session validation

2. Access token expires → POST /auth/refresh
   ↓ Returns new access-token
   └─ Automatically handled by interceptor

3. Both expire → User must login again
   └─ Redirect to /signin
```

### Try It in Postman

```bash
# 1. Sign In
POST /auth/login
Body: { email, password }
Response: Tokens saved to environment

# 2. Make Protected Request
GET /users/{{userId}}
Cookies: access-token=<auto-sent>

# 3. Token Expires?
POST /auth/refresh
Response: New access-token
```

---

## 📖 Using API_Documentation.md

### For Each Endpoint

**Format**:
```
Endpoint Name
├─ HTTP Method: GET/POST/PUT/PATCH/DELETE
├─ URL Path: /path/:param
├─ Guards: Which auth guards required
├─ Request Body: DTO structure
├─ Query Parameters: Filters, pagination
└─ Response: Status code and structure
```

### Examples Included

1. **Sign In Flow** → See authentication section
2. **Submit Code & Get Results** → See submissions section
3. **Get Leaderboard** → See leaderboard section

### Error Handling

All errors follow standard format:
```json
{
  "status": "Failure",
  "error": {
    "message": "Description",
    "statusCode": 400,
    "timestamp": "ISO-8601"
  }
}
```

---

## 💻 Using API_Types_Reference.ts

### Import and Use

```typescript
// In your frontend/backend project
import {
  SignInDto,
  CreateSubmissionDto,
  LeaderboardUser,
  SuccessResponse,
  SubmissionStatus,
} from './API_Types_Reference';

// Type safe API calls
const loginRequest: SignInDto = {
  email: 'user@example.com',
  password: 'securePassword123',
};

// Type hints for responses
async function getLeaderboard() {
  const response = await fetch('/leaderboard/paginated');
  const data: SuccessResponse<LeaderboardPaginatedResponse> = await response.json();
  // Full type safety ✓
}
```

### Type Mappings

```typescript
// Extract request type for an endpoint
type LoginRequest = ExtractRequestType<'POST /auth/login'>;
// => SignInDto

// Extract response type for an endpoint
type LoginResponse = ExtractResponseType<'POST /auth/login'>;
// => SuccessResponse<AuthResponse>
```

### All Enums Available

```typescript
// Roles
Role.User | Role.Admin | Role.Moderator

// Submission Status
SubmissionStatus.PENDING
SubmissionStatus.ACCEPTED
SubmissionStatus.WRONG_ANSWER

// Difficulty
Difficulty.EASY | Difficulty.MEDIUM | Difficulty.HARD
```

---

## 🔄 Common Workflows

### Workflow 1: Complete Submission

```bash
# 1. Get all problems
GET /problems
Response: Problem[]

# 2. Select a problem and submit code
POST /users/:userId/submissions
Body: CreateSubmissionDto

# 3. Get submission details
GET /users/:userId/submissions/:submissionId

# 4. Keep polling (with exponential backoff)
GET /users/:userId/submissions/:submissionId
# Loop until status !== PENDING

# 5. Save stats if accepted
PUT /user-stats/:userId
Body: { difficult: "medium", problemId: ... }

# 6. Check updated rank
GET /leaderboard/user/:userId/position
```

### Workflow 2: LeetCode Admin

```bash
# 1. Login as admin
POST /auth/login (admin account)

# 2. Create problem
POST /problems/createProblem/:userId

# 3. Trigger leaderboard update
POST /leaderboard/recalculate

# 4. Monitor with job ID
# Check job status endpoint (from response)

# 5. Verify results
GET /leaderboard/paginated
```

### Workflow 3: Search & Filter

```bash
# Search users by username
GET /leaderboard/filters?username=john

# Get top users by difficulty
GET /leaderboard/paginated?page=1&limit=50

# Get submissions with filters
GET /users/:userId/submissions?status=ACCEPTED&sortBy=submittedAt&sortOrder=desc
```

---

## 🛠️ Advanced Features

### Batch Operations

```bash
# Submit multiple test cases at once
POST /users/:userId/submissions/batch
Body: { 
  submissions: [CreateSubmissionDto, ...]
}
Response: Submission[]

# Update multiple submissions
PUT /batchupdate/submission
Body: UpdateSubmissionDTO[]
```

### Async Job Processing

```bash
# Long-running operations return job ID
POST /leaderboard/recalculate
Response: { jobId: "xxxx-xxxx-xxxx-xxxx" }

```

### Pagination

```bash
# Default: page 1, 20 per page
GET /leaderboard/paginated

# Custom pagination
GET /leaderboard/paginated?page=2&limit=50

# Response includes pagination metadata
{
  data: LeaderboardUser[],
  pagination: {
    currentPage: 2,
    totalPages: 10,
    totalUsers: 500,
    pageSize: 50
  }
}
```

---

## 🧪 Testing in Postman

### Pre-Request Setup

1. **Variables** → Set `baseUrl` to your backend URL
2. **Auth** → Use Bearer token from environment
3. **Headers** → Content-Type: application/json (auto-set)

### Test Scripts

Each endpoint can include test assertions:

```javascript
// Verify response status
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

// Extract data
pm.test("Has user ID", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.data._id).to.exist;
});
```

### Collection Runner

Run all requests sequentially:

```bash
1. Click "Run" button
2. Select collection: "LeetCode Clone API"
3. Choose environment
4. Set iterations if needed
5. Click "Run LeetCode Clone API"
```

---

## 📝 Common DTO Examples

### Create User

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "favoriteProgrammingLanguage": 93,
  "roles": ["user"]
}
```

### Create Problem

```json
{
  "title": "Two Sum",
  "description": "Find two numbers that add up to target",
  "difficulty": "medium",
  "sampleInput": "[2, 7, 11, 15], 9",
  "sampleOutput": "[0, 1]",
  "testCases": [
    { "input": "[2, 7, 11, 15], 9", "output": "[0, 1]" },
    { "input": "[3, 2, 4], 6", "output": "[1, 2]" }
  ],
  "starterCode": [
    {
      "language": "python",
      "code": "def twoSum(nums, target):\n    pass"
    }
  ]
}
```

### Create Submission

```json
{
  "userId": "64b7c2f5e4b0a2a1b2c3d4e5",
  "problemId": "64b7c2f5e4b0a2a1b2c3d4e6",
  "status": "PENDING",
  "language_id": 93,
  "source_code": "def twoSum(nums, target):\n    # implementation",
  "stdin": "[2, 7, 11, 15]\n9",
  "expected_output": "[0, 1]"
}
```

---

## 🔗 Integration Examples

### React Frontend

```typescript
// Use types for type safety
import { SignInDto, SuccessResponse, User } from './API_Types_Reference';

async function loginUser(credentials: SignInDto) {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include', // Include cookies
  });
  
  const data: SuccessResponse<User> = await response.json();
  return data.data;
}
```

### Node.js Backend

```typescript
import axios from 'axios';
import { SuccessResponse, LeaderboardUser } from './API_Types_Reference';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Include cookies
});

async function getLeaderboard(page: number = 1) {
  const { data } = await api.get<SuccessResponse<LeaderboardUser[]>>(
    '/leaderboard/paginated',
    { params: { page, limit: 50 } }
  );
  return data.data;
}
```

---

## ❓ Troubleshooting

### 401 Unauthorized

```
Problem: Token expired or invalid
Solution:
1. Sign in again (POST /auth/login)
2. Or refresh token (POST /auth/refresh)
3. Check browser cookies are being sent
```

### 403 Forbidden

```
Problem: User doesn't have required role
Solution:
1. Check user role: GET /users/:id
2. Admin role may be required for some endpoints
3. Contact admin to update roles
```

### 400 Bad Request

```
Problem: Invalid request body or parameters
Solution:
1. Check DTO structure matches API_Types_Reference.ts
2. Use Postman collection examples
3. Verify required fields are included
```

### 404 Not Found

```
Problem: Resource doesn't exist
Solution:
1. Verify ObjectIds are correct
2. Ensure resource was created before accessing
3. Check path parameters are passed correctly
```

---

## 📚 Additional Resources

- **NestJS Docs**: https://docs.nestjs.com
- **MongoDB Mongoose**: https://mongoosejs.com
- **Judge0 API**: https://api.judge0.com
- **Postman Docs**: https://learning.postman.com

---

## 🎯 Quick Reference

### Most Used Endpoints

```bash
# Authentication
POST   /auth/login              # Sign in user
POST   /auth/refresh            # Refresh token

# Submissions
POST   /users/:userId/submissions          # Submit code
GET    /users/:userId/submissions/:id      # Check status

# Leaderboard
GET    /leaderboard/paginated              # Get rankings
GET    /leaderboard/user/:userId/position  # Get user rank

# Problems
GET    /problems                           # List all
GET    /problems/:id                       # Get details
```

### Common Query Parameters

```bash
# Pagination
?page=1&limit=20

# Filtering
?status=ACCEPTED&difficulty=medium

# Sorting
?sortBy=submittedAt&sortOrder=desc

# Search
?username=john&period=week
```

---

## 📞 Support

For issues or questions:
1. Check API_Documentation.md for detailed info
2. Review type definitions in API_Types_Reference.ts
3. Test with Postman_Collection.json
4. Check backend logs for error messages

---

**Happy Coding! 🚀**
