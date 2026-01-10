import { NextApiRequest, NextApiResponse } from 'next';
import { CalendarEvent, User } from '../models';
import { validateAvailableClassData, prepareAvailableClassData, formatValidationError } from '../utils/availableClass/validation';
import mongoose from 'mongoose';

// Obtener todas las clases disponibles
export async function getAvailableClasses(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, type, level, topic, location, status, startDate, endDate, minPrice, maxPrice } = req.query;
        let query: any = {};

        if (userId) query.userId = userId;
        if (type) query.type = type;
        if (level) query.level = level;
        if (topic) query.topic = new RegExp(topic as string, 'i');
        if (location) query.location = new RegExp(location as string, 'i');
        if (status) query.status = status;
        if (startDate && endDate) {
            query.start = { 
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const classes = await CalendarEvent
            .find(query)
            .populate('userId', 'fullName email image')
            .sort({ start: 1 });

        return res.status(200).json({ success: true, data: classes });
    } catch (error: any) {
        console.error('Error al obtener clases disponibles:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener clases disponibles', details: error }
        });
    }
}

// Obtener una clase específica
export async function getAvailableClass(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const availableClass = await CalendarEvent
            .findById(id)
            .populate('userId', 'fullName email image');

        if (!availableClass) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Clase no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: availableClass });
    } catch (error: any) {
        console.error('Error al obtener clase:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener la clase', details: error }
        });
    }
}

// Crear una nueva clase disponible
export async function createAvailableClass(req: NextApiRequest, res: NextApiResponse) {
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
        console.log('Datos recibidos en createAvailableClass:', JSON.stringify(req.body, null, 2));
        
        // Mapeo de colores según tipo de evento
        const typeColors: Record<string, string> = {
            'disponibilidad': '#FFE5E5', // Rosa claro
            'agendadas': '#E5FFE5',     // Verde claro
            'ofertas': '#E5E5FF',       // Azul claro
            'recibir': '#FFE5FF'        // Magenta claro
        };

        // Determinar tipo y color por defecto
        const eventType = req.body.type || req.body.eventType || 'ofertas';
        const defaultColor = typeColors[eventType] || '#3498db';

        // Preparar datos de la clase con valores por defecto
        const classData = {
            userId: req.body.userId || req.body.user || '68ce0291c4f5d1435816d910',
            title: req.body.title || req.body.name || 'Clase sin título',
            description: req.body.description || req.body.desc || '',
            start: req.body.start || req.body.startDate || req.body.date || new Date(),
            end: req.body.end || req.body.endDate || req.body.endTime || new Date(Date.now() + 60 * 60 * 1000),
            type: eventType,
            color: req.body.color || req.body.colorCode || defaultColor,
            price: req.body.price || 0,
            level: req.body.level || 'Principiante',
            topic: req.body.topic || req.body.subject || '',
            maxStudents: req.body.maxStudents || 1,
            groupClass: req.body.groupClass || false,
            maxDuration: req.body.maxDuration || 60,
            location: req.body.location || req.body.place || 'Online',
            status: req.body.status || 'pending',
            students: req.body.students || [],
            ...req.body // Incluir cualquier otro campo
        };

        // Validar datos de entrada después de aplicar valores por defecto
        const validation = validateAvailableClassData(classData);
        
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                error: { 
                    message: 'Datos de entrada inválidos',
                    details: validation.errors
                }
            });
        }

        // Preparar datos de la clase para guardar
        const preparedClassData = prepareAvailableClassData(classData);

        const availableClass = new CalendarEvent(preparedClassData);
        await availableClass.save();
        
        // Hacer populate de manera más segura
        const populatedClass = await CalendarEvent.findById(availableClass._id)
            .populate('userId', 'fullName email image')
            .populate('students.id', 'fullName email image');

        return res.status(201).json({ success: true, data: populatedClass });
    } catch (error: any) {
        console.error('Error en createAvailableClass:', error);
        
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
            error: { message: 'Error al crear la clase', details: error.message }
        });
    }
}

// Actualizar una clase disponible
export async function updateAvailableClass(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        
        // Preparar datos de actualización
        const updateData = {
            ...req.body,
            start: req.body.start ? new Date(req.body.start) : undefined,
            end: req.body.end ? new Date(req.body.end) : undefined
        };

        const availableClass = await CalendarEvent.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('userId', 'fullName email image');

        if (!availableClass) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Clase no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: availableClass });
    } catch (error: any) {
        console.error('Error al actualizar clase:', error);
        
        if (error.name === 'ValidationError') {
            const errorDetails = formatValidationError(error);
            return res.status(400).json({
                success: false,
                error: errorDetails
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar la clase', details: error.message }
        });
    }
}

// Eliminar una clase disponible
export async function deleteAvailableClass(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const availableClass = await CalendarEvent.findByIdAndDelete(id);

        if (!availableClass) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Clase no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: null });
    } catch (error: any) {
        console.error('Error al eliminar clase:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar la clase', details: error.message }
        });
    }
}

// Actualizar el estado de una clase
export async function updateAvailableClassStatus(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Estado inválido. Debe ser uno de: ' + validStatuses.join(', ') }
            });
        }

        const availableClass = await CalendarEvent.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true }
        ).populate('userId', 'fullName email image');

        if (!availableClass) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Clase no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: availableClass });
    } catch (error: any) {
        console.error('Error al actualizar estado de clase:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar el estado de la clase', details: error.message }
        });
    }
}

// Inscribir estudiante a una clase
export async function enrollStudent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        // Aceptar ambas formas: {id,name,email} o {studentId,studentName,studentEmail}
        const student = req.body || {};
        const derivedStudentId = student.studentId || student.id;
        const derivedStudentName = student.studentName || student.name;
        const derivedStudentEmail = student.studentEmail || student.email;

        if (!derivedStudentId || !derivedStudentName) {
            return res.status(400).json({
                success: false,
                error: { message: 'studentId y studentName son requeridos' }
            });
        }

        const availableClass = await CalendarEvent.findById(id);
        if (!availableClass) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Clase no encontrada' }
            });
        }

        // Verificar si ya está inscrito
        const existingStudent = availableClass.students.find(
            (s: any) => s.id.toString() === derivedStudentId
        );

        if (existingStudent) {
            return res.status(400).json({
                success: false,
                error: { message: 'El estudiante ya está inscrito en esta clase' }
            });
        }

        // Verificar capacidad máxima
        if (availableClass.students.length >= availableClass.maxStudents) {
            return res.status(400).json({
                success: false,
                error: { message: 'La clase ha alcanzado su capacidad máxima' }
            });
        }

        // Agregar estudiante
        availableClass.students.push({
            id: derivedStudentId,
            name: derivedStudentName,
            email: derivedStudentEmail
        });

        await availableClass.save();

        // Obtener la clase actualizada con populate
        const updatedClass = await CalendarEvent.findById(id)
            .populate('userId', 'fullName email image');

        return res.status(200).json({ success: true, data: updatedClass });
    } catch (error: any) {
        console.error('Error al inscribir estudiante:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al inscribir estudiante', details: error.message }
        });
    }
}

// Desinscribir estudiante de una clase
export async function unenrollStudent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const studentId = req.body?.studentId || req.body?.id;

        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: { message: 'studentId es requerido' }
            });
        }

        const availableClass = await CalendarEvent.findById(id);
        if (!availableClass) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Clase no encontrada' }
            });
        }

        // Remover estudiante
        availableClass.students = availableClass.students.filter(
            (s: any) => s.id.toString() !== studentId
        );

        await availableClass.save();

        // Obtener la clase actualizada con populate
        const updatedClass = await CalendarEvent.findById(id)
            .populate('userId', 'fullName email image');

        return res.status(200).json({ success: true, data: updatedClass });
    } catch (error: any) {
        console.error('Error al desinscribir estudiante:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al desinscribir estudiante', details: error.message }
        });
    }
}
