/**
 * LeetCode Clone - TypeScript Types Reference
 * 
 * This file provides TypeScript interfaces for all API request/response structures
 * Use these types when building frontend clients or analyzing API payloads
 * 
 * Last Updated: March 2026
 */

// ============================================
// ENUMS
// ============================================

export enum Role {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator',
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// ============================================
// RESPONSE WRAPPERS
// ============================================

export interface SuccessResponse<T = any> {
  status: 'Success';
  data: T;
  message?: string;
}

export interface FailureResponse {
  status: 'Failure';
  error: {
    message: string;
    statusCode: number;
    timestamp: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
}

export interface BatchUpdateResponse {
  success: boolean;
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    pageSize: number;
  };
  stats?: {
    total: number;
    accepted: number;
    rejected: number;
  };
}

// ============================================
// AUTH TYPES
// ============================================

export interface SignInDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accesstoken: string;
  refreshtoken: string;
  sessiontoken: string;
}

export interface AuthResponse {
  user: {
    _id: string; // ObjectId
    username: string;
    email: string;
    roles: Role[];
  };
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accesstoken: string;
}

export interface SessionValidationResponse {
  isExpired: boolean;
  user?: string;
}

// ============================================
// USER TYPES
// ============================================

export interface CreateUserDto {
  username: string; // Min 5 chars
  email: string; // Valid email
  password: string; // Min 8 chars
  favoriteProgrammingLanguage: number; // Judge0 language ID
  roles?: Role[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  favoriteProgrammingLanguage?: number;
  roles?: Role[];
}

export interface User {
  _id: string; // ObjectId
  username: string;
  email: string;
  hashedpassword: string;
  favoriteProgrammingLanguage: number;
  submissions: string[]; // ObjectId[]
  roles: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile extends User {
  submissionCount?: number;
  totalPoints?: number;
}

// ============================================
// PROBLEM TYPES
// ============================================

export interface TestCase {
  input: string;
  output: string;
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface CreateProblemDto {
  title: string;
  description?: string;
  difficulty: Difficulty;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  starterCode: CodeSnippet[];
  status?: 'draft' | 'published';
  tags?: string[];
}

export interface UpdateProblemDto {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  sampleInput?: string;
  sampleOutput?: string;
  testCases?: TestCase[];
  starterCode?: CodeSnippet[];
  status?: 'draft' | 'published';
  tags?: string[];
}

export interface Problem {
  _id: string; // ObjectId
  title: string;
  description: string;
  difficulty: Difficulty;
  sampleInput: string;
  sampleOutput: string;
  testCases: TestCase[];
  starterCode: CodeSnippet[];
  status: 'draft' | 'published';
  tags?: string[];
  createdBy?: string; // ObjectId
  submissions?: number; // Count of submissions
  acceptanceRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============================================
// SUBMISSION TYPES
// ============================================

export interface CreateSubmissionDto {
  userId: string; // ObjectId
  problemId: string; // ObjectId
  status: SubmissionStatus;
  language_id: number; // Judge0 language ID
  source_code: string;
  stdin: string;
  expected_output?: string;
  executionTime?: number; // Milliseconds
  memoryUsed?: number; // Kilobytes
  submittedAt?: Date;
  actual_output?: string;
  submissionId?: string;
}

export interface UpdateSubmissionDTO {
  _id?: string; // ObjectId (for batch updates)
  status?: SubmissionStatus;
  executionTime?: number;
  memoryUsed?: number;
  actual_output?: string;
  compileOutput?: string;
}

export interface Submission {
  _id: string; // ObjectId
  userId: string; // ObjectId
  problemId: string; // ObjectId
  status: SubmissionStatus;
  language_id: number;
  source_code: string;
  judge0Token: string;
  judge0Response?: any; // Judge0 full response
  executionTime?: number;
  memoryUsed?: number;
  actual_output?: string;
  expected_output?: string;
  compileOutput?: string;
  stdin?: string;
  submittedAt: Date;
  resultFetchedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionListResponse {
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

// ============================================
// USER STATS TYPES
// ============================================

export interface CreateUserStatDto {
  userId: string; // ObjectId
}

export interface UpdateUserStatDto {
  difficult: Difficulty;
  problemId: string; // ObjectId
}

export interface UpdateOnlineStatusDto {
  isOnline: boolean;
}

export interface UserStat {
  _id: string; // ObjectId
  userId: string; // ObjectId
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalPoints: number;
  rank?: number;
  previousRank?: number;
  isOnline: boolean;
  lastActivityAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStatResponse extends UserStat {
  solvedProblems?: {
    easy: string[]; // Problem ObjectIds
    medium: string[];
    hard: string[];
  };
}

// ============================================
// LEADERBOARD TYPES
// ============================================

export interface LeaderboardUser {
  _id: string; // LeaderboardCache ObjectId
  userId: {
    _id: string; // User ObjectId
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
  lastUpdatedAt?: Date;
}

export interface LeaderboardPaginatedResponse {
  users: LeaderboardUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    pageSize: number;
  };
}

export interface UserPositionResponse {
  rank: number;
  totalPoints: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  previousRank?: number;
  percentile?: number; // Top X%
}

export interface LeaderboardFiltersQuery {
  username?: string;
  period?: 'week' | 'month' | 'all-time';
  page?: number;
  limit?: number;
  sortBy?: 'rank' | 'points' | 'solved' | 'username';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// CACHE & JOB TYPES
// ============================================

export interface JobResponse {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  createdAt: Date;
}

export interface LeaderboardCacheEntry {
  _id: string; // ObjectId
  users: LeaderboardUser[];
  lastUpdatedAt: Date;
  processedAt?: Date;
  totalUsers: number;
  generationTime?: number; // Milliseconds
}

// ============================================
// QUERY PARAMETERS
// ============================================

export interface SubmissionQueryParams {
  page?: number;
  limit?: number;
  status?: SubmissionStatus;
  problemId?: string;
  languageId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeaderboardQueryParams {
  page?: number;
  limit?: number;
}

export interface SearchUsersQueryParams {
  username?: string;
  period?: 'week' | 'month' | 'all-time';
  page?: number;
  limit?: number;
}

// ============================================
// REQUEST/RESPONSE MAPPING
// ============================================

export interface ApiEndpointMap {
  // Auth
  'POST /auth/login': {
    request: SignInDto;
    response: SuccessResponse<AuthResponse>;
  };
  'POST /auth/logout': {
    request: never;
    response: SuccessResponse;
  };
  'POST /auth/refresh': {
    request: never;
    response: SuccessResponse<RefreshTokenResponse>;
  };
  'POST /auth/session/validation': {
    request: never;
    response: SuccessResponse<SessionValidationResponse>;
  };

  // Users
  'GET /users/': {
    request: never;
    response: SuccessResponse<User[]>;
  };
  'GET /users/:id': {
    request: never;
    response: SuccessResponse<User>;
  };
  'POST /users/createUser': {
    request: CreateUserDto;
    response: SuccessResponse<User>;
  };
  'PATCH /users/:id': {
    request: Partial<UpdateUserDto>;
    response: SuccessResponse<User>;
  };
  'PATCH /users/:id/submission': {
    request: { submissionId: string };
    response: SuccessResponse;
  };
  'DELETE /users/:id/:userId': {
    request: never;
    response: SuccessResponse;
  };

  // Problems
  'POST /problems/createProblem/:userId': {
    request: CreateProblemDto;
    response: SuccessResponse<Problem>;
  };
  'GET /problems': {
    request: never;
    response: SuccessResponse<Problem[]>;
  };
  'GET /problems/:id': {
    request: never;
    response: SuccessResponse<Problem>;
  };
  'PATCH /problems/:id/:userId': {
    request: Partial<UpdateProblemDto>;
    response: SuccessResponse<Problem>;
  };
  'DELETE /problems/:id/:userId': {
    request: never;
    response: SuccessResponse;
  };

  // Submissions
  'POST /users/:userId/submissions': {
    request: CreateSubmissionDto;
    response: SuccessResponse<Submission>;
  };
  'POST /users/:userId/submissions/batch': {
    request: { submissions: CreateSubmissionDto[] };
    response: SuccessResponse<Submission[]>;
  };
  'GET /users/:userId/submissions/:id': {
    request: never;
    response: SuccessResponse<Submission>;
  };
  'PUT /users/:userId/submissions/:id': {
    request: Partial<UpdateSubmissionDTO>;
    response: SuccessResponse<Submission>;
  };
  'PUT /batchupdate/submission': {
    request: UpdateSubmissionDTO[];
    response: SuccessResponse;
  };
  'GET /users/:userId/problems/:problemId': {
    request: never;
    response: SuccessResponse<Submission[]>;
  };
  'GET /users/:userId/submissions': {
    request: SubmissionQueryParams;
    response: SuccessResponse<SubmissionListResponse>;
  };

  // User Stats
  'POST /user-stats/create': {
    request: CreateUserStatDto;
    response: SuccessResponse;
  };
  'GET /user-stats/:userId': {
    request: never;
    response: SuccessResponse<UserStatResponse>;
  };
  'PUT /user-stats/:userId': {
    request: UpdateUserStatDto;
    response: SuccessResponse;
  };
  'PATCH /user-stats/:userId/online-status': {
    request: UpdateOnlineStatusDto;
    response: SuccessResponse;
  };

  // Leaderboard
  'GET /leaderboard/paginated': {
    request: LeaderboardQueryParams;
    response: SuccessResponse<LeaderboardPaginatedResponse>;
  };
  'POST /leaderboard/refresh': {
    request: never;
    response: SuccessResponse<JobResponse>;
  };
  'POST /leaderboard/recalculate': {
    request: never;
    response: SuccessResponse<JobResponse>;
  };
  'POST /leaderboard/create': {
    request: never;
    response: SuccessResponse;
  };
  'GET /leaderboard/user/:userId/position': {
    request: never;
    response: SuccessResponse<UserPositionResponse>;
  };
  'GET /leaderboard/filters': {
    request: SearchUsersQueryParams;
    response: SuccessResponse<LeaderboardUser[]>;
  };
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract request type for any endpoint
 * Usage: ExtractRequestType<'POST /auth/login'> => SignInDto
 */
export type ExtractRequestType<E extends keyof ApiEndpointMap> = ApiEndpointMap[E]['request'];

/**
 * Extract response type for any endpoint
 * Usage: ExtractResponseType<'POST /auth/login'> => SuccessResponse<AuthResponse>
 */
export type ExtractResponseType<E extends keyof ApiEndpointMap> = ApiEndpointMap[E]['response'];

// ============================================
// JUDGE0 INTEGRATION
// ============================================

export interface Judge0Language {
  id: number;
  name: string;
  icon_url?: string;
}

export interface Judge0CommonLanguages {
  53: 'C++';
  54: 'C#';
  63: 'JavaScript';
  64: 'Bash';
  71: 'Python';
  93: 'Python (3.11)';
  82: 'SQL (SQLite)';
}

export interface Judge0ExecutionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0ExecutionResponse {
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  exit_code?: number;
  exit_signal?: number;
  status: {
    id: number;
    description: string; // e.g., 'Accepted'
  };
  created_at: string;
  finished_at: string;
  time: string;
  memory: string;
  token: string;
}

// ============================================
// SORTING & FILTERING
// ============================================

export interface SortOptions {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  status?: SubmissionStatus;
  difficulty?: Difficulty;
  language?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchOptions extends SortOptions, FilterOptions {
  page?: number;
  limit?: number;
  query?: string;
}
