import { IsEnum, IsNotEmpty } from 'class-validator';
import { codesnipet } from 'src/interfaces/config.interface';
import { testcase } from 'src/Schemas/problem.schema';

export class CreateProblemDto {
  @IsNotEmpty()
  title: string;

  description: string;

  @IsEnum(['easy', 'medium', 'hard'])
  difficulty: string;

  @IsNotEmpty()
  sampleInput: string;

  @IsNotEmpty()
  sampleOutput: string;

  @IsNotEmpty()
  testCases: testcase[];

  status: string;

  @IsNotEmpty()
  starterCode: codesnipet[];

  @IsNotEmpty()
  systemCode: codesnipet[];
}
