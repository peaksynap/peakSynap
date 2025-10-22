import { NextApiRequest, NextApiResponse } from 'next';
import { Offer } from '../models';
import mongoose from 'mongoose';

// Obtener todas las ofertas
export async function getOffers(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId, topic, status, startDate, endDate } = req.query;
        let query: any = {};

        if (userId) query.userId = userId;
        if (topic) query.topic = topic;
        if (status) query.status = status;
        if (startDate && endDate) {
            query.startDate = { 
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }

        const offers = await Offer
            .find(query)
            .populate('userId', 'name avatar')
            .sort({ startDate: 1 });

        return res.status(200).json({ success: true, data: offers });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener ofertas', details: error }
        });
    }
}

// Obtener una oferta específica
export async function getOffer(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const offer = await Offer
            .findById(id)
            .populate('userId', 'name avatar');

        if (!offer) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Oferta no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: offer });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener la oferta', details: error }
        });
    }
}

// Crear una nueva oferta
export async function createOffer(req: NextApiRequest, res: NextApiResponse) {
    try {
        const offer = new Offer(req.body);
        await offer.save();
        
        const populatedOffer = await offer
            .populate('userId', 'name avatar')
            .execPopulate();

        return res.status(201).json({ success: true, data: populatedOffer });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al crear la oferta', details: error }
        });
    }
}

// Actualizar una oferta
export async function updateOffer(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const offer = await Offer.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        ).populate('userId', 'name avatar');

        if (!offer) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Oferta no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: offer });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar la oferta', details: error }
        });
    }
}

// Eliminar una oferta
export async function deleteOffer(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const offer = await Offer.findByIdAndDelete(id);

        if (!offer) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Oferta no encontrada' }
            });
        }

        return res.status(200).json({ success: true, data: offer });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar la oferta', details: error }
        });
    }
}

// Buscar ofertas
export async function searchOffers(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { 
            topic, 
            minPrice, 
            maxPrice, 
            startDate, 
            endDate, 
            location 
        } = req.query;

        let query: any = {};

        if (topic) query.topic = new RegExp(topic as string, 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (startDate && endDate) {
            query.startDate = { 
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }
        if (location) query.location = new RegExp(location as string, 'i');

        const offers = await Offer
            .find(query)
            .populate('userId', 'name avatar rating')
            .sort({ startDate: 1 });

        return res.status(200).json({ success: true, data: offers });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al buscar ofertas', details: error }
        });
    }
}