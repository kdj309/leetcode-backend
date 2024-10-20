import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Problem } from './problem.schema';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/roles.enum';
import { commonLanguages } from '../constants/index';
const supportedlanguages = commonLanguages.map((l) => l.name);
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ type: String, enum: supportedlanguages })
  favoriteProgrammingLanguage: string;

  @Prop({ default: [] })
  submissions: {
    problemId: { type: mongoose.Schema.Types.ObjectId; ref: Problem };
    submissionId: string;
    languageId: number;
    status: string;
    submittedAt: Date;
  }[];

  @Prop()
  hashedpassword: string;

  @Prop({ default: Role.User })
  roles: Role[];

  securePassword(passsword: string) {
    return bcrypt.hashSync(passsword, 10);
  }

  authenticate(plainpassword: string) {
    return bcrypt.compareSync(plainpassword, this.hashedpassword);
  }
}

export const Userschema = SchemaFactory.createForClass(User);
Userschema.loadClass(User);
Userschema.virtual('password')
  .set(async function (password) {
    this._password = password;
    this.hashedpassword = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });
