import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProblemDto } from './create-problem.dto';
import { testcase } from 'src/Schemas/problem.schema';
import { codesnipet, metadata } from 'src/interfaces/config.interface';

export class UpdateProblemDto extends PartialType(CreateProblemDto) {
  @ApiProperty({
    type: String,
    description: 'The title of the problem (optional).',
    example: 'Two Sum',
    required: false,
  })
  title?: string;

  @ApiProperty({
    type: String,
    description: 'A detailed description of the problem (optional).',
    example:
      'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    type: String,
    description:
      'The difficulty level of the problem (optional). Must be one of: easy, medium, hard.',
    example: 'medium',
    required: false,
  })
  difficulty?: string;

  @ApiProperty({
    type: String,
    description: 'Sample input for the problem (optional).',
    example: '[2, 7, 11, 15], target = 9',
    required: false,
  })
  sampleInput?: string;

  @ApiProperty({
    type: String,
    description: 'Sample output for the problem (optional).',
    example: '[0, 1]',
    required: false,
  })
  sampleOutput?: string;

  @ApiProperty({
    type: [Object],
    description:
      'An array of test cases for the problem (optional). Each test case should include input and expected output.',
    example: [
      { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]' },
      { input: '[3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    required: false,
  })
  testCases?: testcase[];

  @ApiProperty({
    type: String,
    description: 'The status of the problem (optional).',
    example: 'draft',
    required: false,
  })
  status?: string;

  @ApiProperty({
    type: [Object],
    description:
      'An array of starter code snippets for the problem (optional).',
    example: [
      { language: 'python', code: 'def two_sum(nums, target): pass' },
      { language: 'javascript', code: 'function twoSum(nums, target) {}' },
    ],
    required: false,
  })
  starterCode?: codesnipet[];

  @ApiProperty({
    type: [Object],
    description: 'An array of system code snippets for the problem (optional).',
    example: [
      { language: 'python', code: 'def validate_solution(): pass' },
      { language: 'javascript', code: 'function validateSolution() {}' },
    ],
    required: false,
  })
  systemCode?: codesnipet[];

  @ApiProperty({
    type: Object,
    description:
      'Metadata for the problem, such as tags or categories (optional).',
    example: { tags: ['array', 'hashmap'], category: 'Algorithms' },
    required: false,
  })
  metadata?: metadata;
}
