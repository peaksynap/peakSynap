import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  bornDate: Date;
  gender?: string;
  country?: string;
  residence?: string;
  experiences?: string[];
  skills?: string[];
  interests?: string[];
  followers?: string[];
  following?: string[];
  createdAt: Date;
  updatedAt: Date;
  password?: string;
  passwordToken?: string;
  userGroups?: string[];
  image: string;
  description: string;
  rating: number;
  _id: Types.ObjectId;
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
  interests: [{ type: String }],
  followers: [{ type: String }],
  following: [{ type: String }],
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, default: Date.now, required: true },
  password: { type: String, required: true },
  passwordToken: { type: String },
  userGroups: [{ type: String }],
  image: {type: String},
  description: { type: String },
  rating: { type: Number, default: 0 },
},
{
  toJSON: {
    transform(doc, ret) {
      delete ret.password; 
      delete ret.passwordToken; 
      return ret;
    },
  },
  toObject: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.passwordToken;
      return ret;
    },
  },
}
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
