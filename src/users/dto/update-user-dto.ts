import { PartialType } from '@nestjs/mapped-types';
import { createUser } from './create-user.dto';
export class UpdateUserDto extends PartialType(createUser) {}
