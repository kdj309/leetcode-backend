interface ApiConfigProps {
  apiUrl: string;
  httpTimeout: number;
}

interface MongodbConfigProps {
  connectionString: string;
  databaseName: string;
}

export interface ConfigProps {
  port: number;
  api: ApiConfigProps;
  mongodb: {
    database: MongodbConfigProps;
  };
  redis: {
    url: string;
    password: string;
    port: string;
  };
  judge: {
    url: string;
    key: string;
    host: string;
  };
  elasticsearch: {
    node: string;
    username: string;
    password:string
  };
}
export interface signup {
  access_token: string;
  message: string;
}

export interface codesnipet {
  lang_id: number;
  code: string;
}

export interface metadata {
  input_format: string;
  output_format: string;
  judge_input_temple: string;
  variable_names: Record<string, string>;
  variable_types: Record<string, string>;
}

export interface submission {
  problemId: string;
  submissionId: string;
  languageId: number;
  status: string;
  submittedAt: Date;
}
export enum supportedlanguages {
  'C' = 50,
  'C++' = 54,
  'C#' = 51,
  'Go' = 95,
  'Java' = 91,
  'JavaScript' = 93,
  'Python' = 92,
}
export interface SubmissionFilters {
  page?: number;
  limit?: number;
  status?: 'ACCEPTED' | 'WRONG_ANSWER';
  problemId?: string;
  languageId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'submittedAt' | 'executionTime' | 'status';
  sortOrder?: 'asc' | 'desc';
}
export enum LeaderboardJobs {
  RECALCULATE_ALL_RANKS = 'recalculate-all-ranks',
  RECALCULATE_USER_RANK = 'recalculate-user-rank',
  UPDATE_LEADERBOARD_CACHE = 'update-leaderboard-cache',
  CLEANUP_OLD_SNAPSHOTS = 'cleanup-old-snapshots',
}
export interface batchsubmission {
  token: string;
}
