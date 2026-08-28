import { Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { Problem } from 'src/Schemas/problem.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { getSuccessResponse } from 'src/utils';
import { elasticSearchClient } from 'src/api/elasticsearch.singleton';

// Type definitions for Elasticsearch queries
interface ESFilterClause {
  term?: Record<string, string>;
}

interface ESMatchPhraseQuery {
  match_phrase?: {
    title?: {
      query: string;
      boost: number;
    };
  };
}

interface ESMatchQuery {
  match?: {
    title?: {
      query: string;
      boost?: number;
      operator?: 'and' | 'or';
    };
  };
}

interface ESMultiMatchQuery {
  multi_match?: {
    query: string;
    fields: string[];
    fuzziness: string;
    boost?: number;
  };
}
interface ESMatchBoolPrefixQuery {
  match_bool_prefix?: {
    title?: {
      query: string;
      boost: number;
    };
  };
}

type ESShouldClause =
  | ESMatchPhraseQuery
  | ESMatchQuery
  | ESMultiMatchQuery
  | ESMatchBoolPrefixQuery;

interface ESBoolQuery {
  should?: ESShouldClause[];
  minimum_should_match?: number;
  filter?: ESFilterClause[];
}

@Injectable()
export class ProblemsService {
  constructor(
    @InjectModel(Problem.name) private problemModule: Model<Problem>,
  ) {}
  async create(createProblemDto: CreateProblemDto) {
    try {
      const problem = new this.problemModule(createProblemDto);
      await problem.save();
      return getSuccessResponse(problem, 'Problem Created Succesfully');
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`error in problem create method ${error.message}`);
    }

    return 'Problem saved successfully';
  }

  async findAll(page = 1, limit = 10) {
    try {
      // Validate pagination parameters
      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.max(1, Number(limit) || 10);
      const skip = (pageNum - 1) * limitNum;

      // Get total count for pagination
      const total = await this.problemModule.countDocuments();

      // Fetch paginated problems
      const problems = await this.problemModule
        .find()
        .select(
          '-sampleInput -sampleOutput -testCases -starterCode -systemCode',
        )
        .skip(skip)
        .limit(limitNum);

      return getSuccessResponse(
        {
          problems,
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
        'Fetched all problems',
      );
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`error in problems findall method ${error.message}`);
    }
  }

  async findOne(id: ObjectId) {
    try {
      const problem = await this.problemModule.findById(id);
      if (!problem) {
        return null;
      }
      return getSuccessResponse(problem, 'Successfully fetched the problem');
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`error in problem findone method ${error.message}`);
    }
  }

  async update(id: ObjectId, updateProblemDto: UpdateProblemDto) {
    try {
      const problem = await this.problemModule.findByIdAndUpdate(
        id,
        updateProblemDto,
        {
          new: true,
        },
      );
      if (!problem) {
        throw new Error('Update Failed');
      }
      return getSuccessResponse(problem, 'Successfully updated the problem');
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`error in problem update method ${error.message}`);
    }
  }

  async remove(id: ObjectId) {
    try {
      await this.problemModule.findByIdAndDelete(id);
      return getSuccessResponse(
        `Problem ${id}`,
        'Problem deleted successfully',
      );
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`error in problem remove method ${error.message}`);
    }
  }
  async searchProblems(
    page: number,
    limit: number,
    query?: string,
    difficulty?: string,
  ) {
    try {
      if (!query && !difficulty) {
        const problems = await this.problemModule
          .find()
          .select(
            '-sampleInput -sampleOutput -testCases -starterCode -systemCode',
          );
        return getSuccessResponse(problems, 'Fetched all problems');
      }

      // Build filter conditions
      const filters: ESFilterClause[] = [];
      if (difficulty) {
        filters.push({
          term: { difficulty: difficulty.toLowerCase() },
        });
      }

      // Build should clauses (query matching)
      const shouldClauses: ESShouldClause[] = [];
      if (query) {
        shouldClauses.push({
          match_phrase: {
            title: {
              query,
              boost: 20,
            },
          },
        });

        shouldClauses.push({
          match_bool_prefix: {
            title: {
              query,
              boost: 15,
            },
          },
        });

        shouldClauses.push({
          match: {
            title: {
              query,
              boost: 10,
              operator: 'and',
            },
          },
        });
      }

      // Build the bool query
      const boolQuery: ESBoolQuery = {};
      if (shouldClauses.length > 0) {
        boolQuery.should = shouldClauses;
        boolQuery.minimum_should_match = 1;
      }
      if (filters.length > 0) {
        boolQuery.filter = filters;
      }

      const response = await elasticSearchClient.search({
        index: 'problems_v3',
        from: (page - 1) * limit,
        size: limit,
        query:
          Object.keys(boolQuery).length > 0
            ? { bool: boolQuery }
            : { match_all: {} },
      });

      const hits = response.hits.hits;
      const totalResults =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : response.hits.total.value;
      return getSuccessResponse(
        { results: hits, total: totalResults },
        'Search completed successfully',
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`[searchProblems] ${errorMessage}`);
    }
  }
}
