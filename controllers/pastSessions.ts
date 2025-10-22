import { NextApiRequest, NextApiResponse } from 'next';
import { PastSession } from '../models';
import mongoose from 'mongoose';

// Obtener todas las sesiones pasadas de un usuario
export async function getPastSessions(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, startDate, endDate } = req.query;
        let query: any = {};

        if (userId) query.userId = userId;
        if (startDate && endDate) {
            query.date = { 
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }

        const sessions = await PastSession
            .find(query)
            .populate('userId', 'name avatar')
            .populate('eventId', 'title type')
            .sort({ date: -1 });

        return res.status(200).json({ success: true, data: sessions });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener sesiones pasadas', details: error }
        });
    }
}

// Obtener una sesión pasada específica
export async function getPastSession(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const session = await PastSession
            .findById(id)
            .populate('userId', 'name avatar')
            .populate('eventId', 'title type');

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Sesión no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: session });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener la sesión', details: error }
        });
    }
}

// Crear una nueva sesión pasada
export async function createPastSession(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = new PastSession(req.body);
        await session.save();
        
        const populatedSession = await session
            .populate('userId', 'name avatar')
            .populate('eventId', 'title type')
            .execPopulate();

        return res.status(201).json({ success: true, data: populatedSession });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al crear la sesión', details: error }
        });
    }
}

// Actualizar una sesión pasada
export async function updatePastSession(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const session = await PastSession.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        .populate('userId', 'name avatar')
        .populate('eventId', 'title type');

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Sesión no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: session });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar la sesión', details: error }
        });
    }
}

// Eliminar una sesión pasada
export async function deletePastSession(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const session = await PastSession.findByIdAndDelete(id);

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Sesión no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: session });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar la sesión', details: error }
        });
    }
}

// Agregar archivos adjuntos a una sesión
export async function addAttachment(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const attachment = req.body;

        const session = await PastSession.findByIdAndUpdate(
            id,
            { $push: { attachments: attachment } },
            { new: true }
        )
        .populate('userId', 'name avatar')
        .populate('eventId', 'title type');

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Sesión no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: session });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al agregar archivo adjunto', details: error }
        });
    }
}

// Eliminar un archivo adjunto de una sesión
export async function removeAttachment(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id, attachmentId } = req.query;

        const session = await PastSession.findByIdAndUpdate(
            id,
            { $pull: { attachments: { id: attachmentId } } },
            { new: true }
        )
        .populate('userId', 'name avatar')
        .populate('eventId', 'title type');

        if (!session) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Sesión no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: session });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar archivo adjunto', details: error }
        });
    }
}