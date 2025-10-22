import mongoose from 'mongoose';

export interface EventValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validateEventData = (eventData: any): EventValidationResult => {
    const errors: string[] = [];
    
    // Logs de debugging (remover en producción)
    console.log('Validando datos del evento:', JSON.stringify(eventData, null, 2));
    console.log('Campos disponibles:', Object.keys(eventData));
    
    // Validar campos requeridos
    if (!eventData.userId) {
        errors.push('userId es requerido');
    } else if (!mongoose.Types.ObjectId.isValid(eventData.userId)) {
        errors.push('userId debe ser un ObjectId válido');
    }
    
    if (!eventData.title) {
        errors.push('title es requerido');
    }
    
    if (!eventData.start) {
        errors.push('start es requerido');
    } else {
        const startDate = new Date(eventData.start);
        if (isNaN(startDate.getTime())) {
            errors.push('start debe ser una fecha válida');
        }
    }
    
    if (!eventData.end) {
        errors.push('end es requerido');
    } else {
        const endDate = new Date(eventData.end);
        if (isNaN(endDate.getTime())) {
            errors.push('end debe ser una fecha válida');
        }
    }
    
    if (!eventData.color) {
        errors.push('color es requerido');
    }
    
    if (!eventData.type) {
        errors.push('type es requerido');
    } else {
        const validTypes = ['disponibilidad', 'agendadas', 'ofertas', 'recibir'];
        if (!validTypes.includes(eventData.type)) {
            errors.push(`type debe ser uno de: ${validTypes.join(', ')}`);
        }
    }
    
    // Validar que end sea después de start
    if (eventData.start && eventData.end) {
        const startDate = new Date(eventData.start);
        const endDate = new Date(eventData.end);
        if (endDate <= startDate) {
            errors.push('end debe ser posterior a start');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

export const prepareEventData = (eventData: any) => {
    return {
        ...eventData,
        start: eventData.start ? new Date(eventData.start) : undefined,
        end: eventData.end ? new Date(eventData.end) : undefined
    };
};

export const formatValidationError = (error: any) => {
    if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => ({
            field: err.path,
            message: err.message,
            value: err.value
        }));
        
        return {
            message: 'Error de validación',
            details: validationErrors
        };
    }
    
    return {
        message: error.message || 'Error desconocido',
        details: error
    };
};
