import { NextApiRequest, NextApiResponse } from 'next';
import { CalendarEvent, User } from '../models';
import { validateEventData, prepareEventData, formatValidationError } from '../utils/events/validation';
import mongoose from 'mongoose';

// Obtener todos los eventos
export async function getEvents(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, type, startDate, endDate } = req.query;
        let query: any = {};

        if (userId) query.userId = userId;
        if (type) query.type = type;
        if (startDate && endDate) {
            query.start = { 
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }

        const events = await CalendarEvent
            .find(query)
            .populate('userId', 'fullName email image')
            .sort({ start: 1 });

        return res.status(200).json({ success: true, data: events });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener eventos', details: error }
        });
    }
}

// Obtener un evento específico
export async function getEvent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const event = await CalendarEvent
            .findById(id)
            .populate('userId', 'fullName email image')
            .populate('students.id', 'fullName email image');

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Evento no encontrado' }
            });
        }

        return res.status(200).json({ success: true, data: event });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener el evento', details: error }
        });
    }
}

// Crear un nuevo evento
export async function createEvent(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Verificar que el modelo User esté registrado
        if (!mongoose.models.User) {
            console.error('Modelo User no está registrado');
            return res.status(500).json({ 
                success: false, 
                error: { message: 'Error interno: modelo User no disponible' }
            });
        }

        // Log de datos recibidos para debugging (remover en producción)
        console.log('Datos recibidos en createEvent:', JSON.stringify(req.body, null, 2));
        
        // Preparar datos del evento con valores por defecto
        const eventData = {
            userId: req.body.userId || req.body.user || '68ce0291c4f5d1435816d910', // Usar userId por defecto si no se proporciona
            title: req.body.title || req.body.name || 'Evento sin título',
            description: req.body.description || req.body.desc || '',
            start: req.body.start || req.body.startDate || req.body.date || new Date(),
            end: req.body.end || req.body.endDate || req.body.endTime || new Date(Date.now() + 60 * 60 * 1000), // 1 hora después
            color: req.body.color || req.body.colorCode || '#3498db',
            type: req.body.type || req.body.eventType || 'agendadas',
            price: req.body.price || 0,
            level: req.body.level || 'intermedio',
            topic: req.body.topic || req.body.subject || '',
            maxStudents: req.body.maxStudents || 1,
            groupClass: req.body.groupClass || false,
            maxDuration: req.body.maxDuration || 60,
            location: req.body.location || req.body.place || '',
            status: req.body.status || 'pending',
            students: req.body.students || [],
            ...req.body // Incluir cualquier otro campo
        };

        // Validar datos de entrada después de aplicar valores por defecto
        const validation = validateEventData(eventData);
        
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: { 
                    message: 'Datos de entrada inválidos',
                    details: validation.errors
                }
            });
        }

        // Preparar datos del evento para guardar
        const preparedEventData = prepareEventData(eventData);

        const event = new CalendarEvent(preparedEventData);
        await event.save();
        
        // Hacer populate de manera más segura
        const populatedEvent = await CalendarEvent.findById(event._id)
            .populate('userId', 'fullName email image')
            .populate('students.id', 'fullName email image');

        return res.status(201).json({ success: true, data: populatedEvent });
    } catch (error:any) {
        console.error('Error en createEvent:', error);
        
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errorDetails = formatValidationError(error);
            return res.status(400).json({
                success: false,
                error: errorDetails
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al crear el evento', details: error.message }
        });
    }
}

// Actualizar un evento
export async function updateEvent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const event = await CalendarEvent.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        ).populate('userId', 'fullName email image')
         .populate('students.id', 'fullName email image');

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Evento no encontrado' }
            });
        }

        return res.status(200).json({ success: true, data: event });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar el evento', details: error }
        });
    }
}

// Eliminar un evento
export async function deleteEvent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const event = await CalendarEvent.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Evento no encontrado' }
            });
        }

        return res.status(200).json({ success: true, data: event });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar el evento', details: error }
        });
    }
}

// Actualizar el estado de un evento
export async function updateEventStatus(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { status } = req.body;

        const event = await CalendarEvent.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        ).populate('userId', 'fullName email image')
         .populate('students.id', 'fullName email image');

        if (!event) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Evento no encontrado' }
            });
        }

        return res.status(200).json({ success: true, data: event });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar el estado del evento', details: error }
        });
    }
}