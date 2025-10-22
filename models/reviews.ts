import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
    reviewerId: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId;
    eventId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'CalendarEvent', required: true },
    rating: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5 
    },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

// Índices para mejorar el rendimiento de las búsquedas
ReviewSchema.index({ targetId: 1, date: -1 });
ReviewSchema.index({ reviewerId: 1, date: -1 });
ReviewSchema.index({ eventId: 1 });

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);