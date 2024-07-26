import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Problem } from './problem.schema';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;
const commonLanguages = ['Java', 'Python', 'JavaScript', 'C++', 'C'];
@Schema()
export class User {
  _password: string;

  @Prop({ required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    default: [],
  })
  solvedproblems: Problem[];

  @Prop({ type: String, enum: commonLanguages })
  favoriteProgrammingLanguage: string;

  @Prop({ default: [] })
  submissions: {
    problemId: mongoose.Schema.Types.ObjectId;
    submissionId: string;
    status: string;
    submittedAt: Date;
  }[];

  @Prop()
  hashedpassword: string;

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
