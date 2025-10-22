import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendarEvent extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    color: string;
    type: 'disponibilidad' | 'agendadas' | 'ofertas' | 'recibir';
    students?: Array<{
        id: mongoose.Types.ObjectId;
        name: string;
        email?: string;
    }>;
    price?: number;
    level?: string;
    topic?: string;
    maxStudents?: number;
    groupClass: boolean;
    maxDuration?: number;
    location?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

const CalendarEventSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    color: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['disponibilidad', 'agendadas', 'ofertas', 'recibir'],
        required: true 
    },
    students: [{
        id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        email: { type: String }
    }],
    price: { type: Number },
    level: { type: String },
    topic: { type: String },
    maxStudents: { type: Number },
    groupClass: { type: Boolean, default: false },
    maxDuration: { type: Number },
    location: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.models.CalendarEvent || mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);