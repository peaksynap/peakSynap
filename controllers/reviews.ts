import { NextApiRequest, NextApiResponse } from 'next';
import Review from '../models/reviews';
import mongoose from 'mongoose';

// Obtener reseñas por usuario objetivo
export async function getUserReviews(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { targetId } = req.query;
        const reviews = await Review
            .find({ targetId })
            .populate('reviewerId', 'name avatar')
            .populate('eventId', 'title date')
            .sort({ date: -1 });

        return res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al obtener reseñas', details: error }
        });
    }
}

// Crear una nueva reseña
export async function createReview(req: NextApiRequest, res: NextApiResponse) {
    try {
        const review = new Review(req.body);
        await review.save();
        
        const populatedReview = await review
            .populate('reviewerId', 'name avatar')
            .populate('targetId', 'name avatar')
            .populate('eventId', 'title date')
            .execPopulate();

        // Actualizar el rating promedio del usuario objetivo
        await updateUserRating(review.targetId);

        return res.status(201).json({ success: true, data: populatedReview });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al crear la reseña', details: error }
        });
    }
}

// Actualizar una reseña
export async function updateReview(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const review = await Review.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )
        .populate('reviewerId', 'name avatar')
        .populate('targetId', 'name avatar')
        .populate('eventId', 'title date');

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Reseña no encontrada' }
            });
        }

        // Actualizar el rating promedio del usuario objetivo
        await updateUserRating(review.targetId);

        return res.status(200).json({ success: true, data: review });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al actualizar la reseña', details: error }
        });
    }
}

// Eliminar una reseña
export async function deleteReview(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return res.status(404).json({ 
                success: false, 
                error: { message: 'Reseña no encontrada' }
            });
        }

        // Actualizar el rating promedio del usuario objetivo
        await updateUserRating(review.targetId);

        return res.status(200).json({ success: true, data: review });
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            error: { message: 'Error al eliminar la reseña', details: error }
        });
    }
}

// Función auxiliar para actualizar el rating promedio de un usuario
async function updateUserRating(userId: mongoose.Types.ObjectId) {
    try {
        const reviews = await Review.find({ targetId: userId });
        const totalReviews = reviews.length;
        
        if (totalReviews > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / totalReviews;

            // Actualizar el usuario con el nuevo rating promedio
            await mongoose.model('User').findByIdAndUpdate(userId, {
                rating: averageRating,
                totalReviews
            });
        }
    } catch (error) {
        console.error('Error al actualizar rating del usuario:', error);
    }
}