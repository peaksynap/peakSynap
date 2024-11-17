import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  bornDate: Date;
  gender?: string;
  country?: string;
  residence?: string;
  experiences?: string[];
  skills?: string[];
  knowledge?: string[];
  hobbies?: string[];
  interests?: string[];
  followers?: string[];
  following?: string[];
  createdAt: Date;
  updatedAt: Date;
  password: string;
  passwordToken?: string;
  userGroups?: string[];
}

const UserSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bornDate: { type: Date, required: true },
  gender: { type: String },
  country: { type: String },
  residence: { type: String },
  experiences: [{ type: String }],
  skills: [{ type: String }],
  knowledge: [{ type: String }],
  hobbies: [{ type: String }],
  interests: [{ type: String }],
  followers: [{ type: String }],
  following: [{ type: String }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  password: { type: String, required: true },
  passwordToken: { type: String },
  userGroups: [{ type: String }]
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
