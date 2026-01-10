import { NextApiRequest, NextApiResponse } from 'next';
import { Offer } from '../models';

// Obtener todas las búsquedas
export async function getSearches(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { 
            topics, 
            schedule, 
            timeSlots, 
            minPrice, 
            maxPrice, 
            searchQuery 
        } = req.query;

        let query: any = { status: 'active' };

        if (topics && Array.isArray(topics)) {
            query.topic = { $in: topics };
        } else if (topics) {
            query.topic = new RegExp(topics as string, 'i');
        }

        if (schedule && Array.isArray(schedule)) {
            query.schedule = { $in: schedule };
        }

        if (timeSlots && Array.isArray(timeSlots)) {
            query.timeSlot = { $in: timeSlots };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (searchQuery) {
            query.$or = [
                { name: new RegExp(searchQuery as string, 'i') },
                { topic: new RegExp(searchQuery as string, 'i') },
                { description: new RegExp(searchQuery as string, 'i') }
            ];
        }

        const searches = await Offer
            .find(query)
            .populate('userId', 'fullName email image')
            .sort({ startDate: 1 });

        return res.status(200).json({ success: true, data: searches });
    } catch (error: any) {
        console.error('Error al obtener búsquedas:', error);
        return res.status(500).json({ 
            success: false,
            data: [],
            error: 'Error al obtener búsquedas'
        });
    }
}

// Obtener una búsqueda específica
export async function getSearch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const search = await Offer
            .findById(id)
            .populate('userId', 'fullName email image');

        if (!search) {
            return res.status(404).json({ 
                success: false,
                error: 'Búsqueda no encontrada'
            });
        }

        return res.status(200).json({ success: true, data: search });
    } catch (error: any) {
        console.error('Error al obtener búsqueda:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al obtener la búsqueda'
        });
    }
}

// Crear una nueva búsqueda
export async function createSearch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const search = new Offer(req.body);
        await search.save();
        
        const populatedSearch = await Offer.findById(search._id)
            .populate('userId', 'fullName email image');

        return res.status(201).json({ success: true, data: populatedSearch });
    } catch (error: any) {
        console.error('Error al crear búsqueda:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al crear la búsqueda'
        });
    }
}

// Actualizar una búsqueda
export async function updateSearch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const search = await Offer.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        ).populate('userId', 'fullName email image');

        if (!search) {
            return res.status(404).json({ 
                success: false,
                error: 'Búsqueda no encontrada'
            });
        }

        return res.status(200).json({ success: true, data: search });
    } catch (error: any) {
        console.error('Error al actualizar búsqueda:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al actualizar la búsqueda'
        });
    }
}

// Eliminar una búsqueda
export async function deleteSearch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const search = await Offer.findByIdAndDelete(id);

        if (!search) {
            return res.status(404).json({ 
                success: false,
                error: 'Búsqueda no encontrada'
            });
        }

        return res.status(200).json({ success: true, data: null });
    } catch (error: any) {
        console.error('Error al eliminar búsqueda:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al eliminar la búsqueda'
        });
    }
}

// Aplicar a búsqueda
export async function applyToSearch(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                error: 'userId es requerido'
            });
        }

        const search = await Offer.findById(id);
        if (!search) {
            return res.status(404).json({ 
                success: false,
                error: 'Búsqueda no encontrada'
            });
        }

        // Aquí podrías agregar lógica para almacenar la aplicación
        // Por ejemplo, agregar un campo 'applications' al modelo Offer

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error('Error al aplicar a búsqueda:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al aplicar a la búsqueda'
        });
    }
}

// Obtener búsquedas de un usuario
export async function getUserSearches(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ 
                success: false,
                error: 'userId es requerido'
            });
        }

        const searches = await Offer
            .find({ userId })
            .populate('userId', 'fullName email image')
            .sort({ startDate: 1 });

        return res.status(200).json({ success: true, data: searches });
    } catch (error: any) {
        console.error('Error al obtener búsquedas del usuario:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al obtener búsquedas del usuario'
        });
    }
}

