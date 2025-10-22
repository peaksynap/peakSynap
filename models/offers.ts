import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    topic: string;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    avatar: string;
    coverImage?: string;
    price: number;
    currency: string;
    rating: number;
    timeSlot: string;
    description?: string;
    level?: string;
    duration: number;
    maxStudents?: number;
    location?: string;
    requirements: string[];
    materials: string[];
    status: 'active' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

const OfferSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    topic: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    avatar: { type: String, required: true },
    coverImage: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    rating: { type: Number, default: 0 },
    timeSlot: { type: String, required: true },
    description: { type: String },
    level: { type: String },
    duration: { type: Number, required: true },
    maxStudents: { type: Number },
    location: { type: String },
    requirements: [{ type: String }],
    materials: [{ type: String }],
    status: { 
        type: String, 
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    }
}, { timestamps: true });

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);