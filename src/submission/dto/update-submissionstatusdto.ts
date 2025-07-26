import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";

export class UpdateSubmissionDTO{
  @ApiProperty({
    type: String,
    description: 'The status of the submission (e.g., Accepted, Wrong Answer, Runtime Error).',
    example: 'Accepted',
  })
  @IsNotEmpty()
  @IsIn(["ACCEPTED","WRONG_ANSWER"])
  status: string;
}