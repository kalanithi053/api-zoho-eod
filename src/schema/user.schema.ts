// user.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

// --- Nested Configuration Schema ---
@Schema({ _id: false })
export class UserConfiguration {
  @Prop({ default: false })
  validatedGoogle!: boolean;

  @Prop({ default: null })
  googleRefreshToken!: string;

  @Prop({ default: false })
  validatedZoho!: boolean;

  @Prop({ default: null })
  zohoRefreshToken!: string;

  @Prop({ default: null })
  cronOption!: string;
}

export const UserConfigurationSchema =
  SchemaFactory.createForClass(UserConfiguration);

// --- Main User Schema ---
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ default: null })
  userProfileUrl!: string;

  @Prop({ type: UserConfigurationSchema, default: () => ({}) })
  configuration!: UserConfiguration;
}

export const UserSchema = SchemaFactory.createForClass(User);
