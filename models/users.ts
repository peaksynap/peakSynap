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
  // Nuevos campos para perfil completo
  coverImage?: string;
  topic?: string;
  phone?: string;
  website?: string;
  education?: string;
  languages?: string[];
  specialties?: string[]; // Alias de skills
  // Redes sociales
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  // Disponibilidad
  isOnline?: boolean;
  isInPerson?: boolean;
  isHybrid?: boolean;
  // Precios
  individualPricing?: number;
  groupPricing?: number;
  pricingCurrency?: string;
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
  // Nuevos campos
  coverImage: { type: String },
  topic: { type: String },
  phone: { type: String },
  website: { type: String },
  education: { type: String },
  languages: [{ type: String }],
  specialties: [{ type: String }],
  instagram: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  isOnline: { type: Boolean, default: true },
  isInPerson: { type: Boolean, default: false },
  isHybrid: { type: Boolean, default: false },
  individualPricing: { type: Number },
  groupPricing: { type: Number },
  pricingCurrency: { type: String, default: 'USD' },
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
