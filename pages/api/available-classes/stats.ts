import { NextApiRequest, NextApiResponse } from 'next';
import { CalendarEvent } from '../../../models';
import { connect } from '../../../dataBase/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connect();

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: { message: 'Método no permitido' } 
        });
    }

    try {
        const { userId } = req.query;

        // Construir query base
        let baseQuery = {};
        if (userId) {
            baseQuery = { userId };
        }

        // Obtener estadísticas
        const [
            totalClasses,
            pendingClasses,
            confirmedClasses,
            cancelledClasses,
            completedClasses,
            classesByType,
            classesByLevel,
            totalStudents,
            averagePrice
        ] = await Promise.all([
            // Total de clases
            CalendarEvent.countDocuments(baseQuery),
            
            // Clases por estado
            CalendarEvent.countDocuments({ ...baseQuery, status: 'pending' }),
            CalendarEvent.countDocuments({ ...baseQuery, status: 'confirmed' }),
            CalendarEvent.countDocuments({ ...baseQuery, status: 'cancelled' }),
            CalendarEvent.countDocuments({ ...baseQuery, status: 'completed' }),
            
            // Clases por tipo
            CalendarEvent.aggregate([
                { $match: baseQuery },
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ]),
            
            // Clases por nivel
            CalendarEvent.aggregate([
                { $match: baseQuery },
                { $group: { _id: '$level', count: { $sum: 1 } } }
            ]),
            
            // Total de estudiantes inscritos
            CalendarEvent.aggregate([
                { $match: baseQuery },
                { $unwind: '$students' },
                { $count: 'totalStudents' }
            ]),
            
            // Precio promedio
            CalendarEvent.aggregate([
                { $match: baseQuery },
                { $group: { _id: null, averagePrice: { $avg: '$price' } } }
            ])
        ]);

        const stats = {
            totalClasses,
            statusBreakdown: {
                pending: pendingClasses,
                confirmed: confirmedClasses,
                cancelled: cancelledClasses,
                completed: completedClasses
            },
            typeBreakdown: classesByType,
            levelBreakdown: classesByLevel,
            totalStudents: totalStudents[0]?.totalStudents || 0,
            averagePrice: averagePrice[0]?.averagePrice || 0
        };

        return res.status(200).json({ 
            success: true, 
            data: stats 
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener estadísticas', details: error.message }
        });
    }
}
