import mongoose, { Schema, Document } from 'mongoose';

export interface IPastSession extends Document {
    eventId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    name: string;
    topic: string;
    date: Date;
    time: string;
    level?: string;
    price?: number;
    location?: string;
    duration: number;
    notes?: string;
    rating?: number;
    feedback?: string;
    attachments: Array<{
        id: string;
        name: string;
        type: 'image' | 'pdf' | 'excel' | 'document';
        url: string;
        size: number;
        uploadedAt: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const AttachmentSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['image', 'pdf', 'excel', 'document'],
        required: true 
    },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

const PastSessionSchema: Schema = new Schema({
    eventId: { type: Schema.Types.ObjectId, ref: 'CalendarEvent', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    topic: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    level: { type: String },
    price: { type: Number },
    location: { type: String },
    duration: { type: Number, required: true },
    notes: { type: String },
    rating: { 
        type: Number,
        min: 1,
        max: 5
    },
    feedback: { type: String },
    attachments: [AttachmentSchema]
}, { timestamps: true });

// Índices para mejorar el rendimiento
PastSessionSchema.index({ userId: 1, date: -1 });
PastSessionSchema.index({ eventId: 1 });

export default mongoose.models.PastSession || mongoose.model<IPastSession>('PastSession', PastSessionSchema);