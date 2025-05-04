import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { codesnipet, metadata } from 'src/interfaces/config.interface';
import { testcase } from 'src/Schemas/problem.schema';

export class CreateProblemDto {
  @ApiProperty({
    type: String,
    description: 'The title of the problem (required).',
    example: 'Two Sum',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'A detailed description of the problem (optional).',
    example:
      'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
    required: false,
  })
  description: string;

  @ApiProperty({
    type: String,
    description:
      'The difficulty level of the problem (required). Must be one of: easy, medium, hard.',
    example: 'medium',
  })
  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: string;

  @ApiProperty({
    type: String,
    description: 'Sample input for the problem (required).',
    example: '[2, 7, 11, 15], target = 9',
  })
  @IsNotEmpty()
  sampleInput: string;

  @ApiProperty({
    type: String,
    description: 'Sample output for the problem (required).',
    example: '[0, 1]',
  })
  @IsNotEmpty()
  sampleOutput: string;

  @ApiProperty({
    type: [Object],
    description:
      'An array of test cases for the problem (required). Each test case should include input and expected output.',
    example: [
      { input: '[2, 7, 11, 15], target = 9', output: '[0, 1]' },
      { input: '[3, 2, 4], target = 6', output: '[1, 2]' },
    ],
  })
  @IsNotEmpty()
  testCases: testcase[];

  @ApiProperty({
    type: String,
    description: 'The status of the problem (optional).',
    example: 'draft',
    required: false,
  })
  status: string;

  @ApiProperty({
    type: [Object],
    description:
      'An array of starter code snippets for the problem (required).',
    example: [
      { language: 'python', code: 'def two_sum(nums, target): pass' },
      { language: 'javascript', code: 'function twoSum(nums, target) {}' },
    ],
  })
  @IsNotEmpty()
  starterCode: codesnipet[];

  @ApiProperty({
    type: [Object],
    description: 'An array of system code snippets for the problem (required).',
    example: [
      { language: 'python', code: 'def validate_solution(): pass' },
      { language: 'javascript', code: 'function validateSolution() {}' },
    ],
  })
  @IsNotEmpty()
  systemCode: codesnipet[];

  @ApiProperty({
    type: Object,
    description:
      'Metadata for the problem, such as tags or categories (required).',
    example: { tags: ['array', 'hashmap'], category: 'Algorithms' },
  })
  @IsNotEmpty()
  metadata: metadata;
}
