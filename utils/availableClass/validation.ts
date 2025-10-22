import mongoose from 'mongoose';

export interface AvailableClassValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validateAvailableClassData = (classData: any): AvailableClassValidationResult => {
    const errors: string[] = [];
    
    // Logs de debugging (remover en producción)
    console.log('Validando datos de clase disponible:', JSON.stringify(classData, null, 2));
    console.log('Campos disponibles:', Object.keys(classData));
    
    // Validar campos requeridos
    if (!classData.userId) {
        errors.push('userId es requerido');
    } else if (!mongoose.Types.ObjectId.isValid(classData.userId)) {
        errors.push('userId debe ser un ObjectId válido');
    }
    
    if (!classData.title) {
        errors.push('title es requerido');
    } else if (classData.title.length < 3) {
        errors.push('title debe tener al menos 3 caracteres');
    }
    
    if (!classData.start) {
        errors.push('start es requerido');
    } else {
        const startDate = new Date(classData.start);
        if (isNaN(startDate.getTime())) {
            errors.push('start debe ser una fecha válida');
        }
    }
    
    if (!classData.end) {
        errors.push('end es requerido');
    } else {
        const endDate = new Date(classData.end);
        if (isNaN(endDate.getTime())) {
            errors.push('end debe ser una fecha válida');
        }
    }
    
    if (!classData.color) {
        errors.push('color es requerido');
    } else if (!/^#[0-9A-F]{6}$/i.test(classData.color)) {
        errors.push('color debe ser un código hexadecimal válido (ej: #FF0000)');
    }
    
    if (!classData.type) {
        errors.push('type es requerido');
    } else {
        const validTypes = ['disponibilidad', 'agendadas', 'ofertas', 'recibir'];
        if (!validTypes.includes(classData.type)) {
            errors.push(`type debe ser uno de: ${validTypes.join(', ')}`);
        }
    }
    
    // Validar campos específicos de clase
    if (classData.price !== undefined && (typeof classData.price !== 'number' || classData.price < 0)) {
        errors.push('price debe ser un número mayor o igual a 0');
    }
    
    if (classData.level) {
        const validLevels = ['Principiante', 'Intermedio', 'Avanzado'];
        if (!validLevels.includes(classData.level)) {
            errors.push(`level debe ser uno de: ${validLevels.join(', ')}`);
        }
    }
    
    if (classData.maxStudents !== undefined && (typeof classData.maxStudents !== 'number' || classData.maxStudents < 1)) {
        errors.push('maxStudents debe ser un número mayor a 0');
    }
    
    if (classData.maxDuration !== undefined && (typeof classData.maxDuration !== 'number' || classData.maxDuration < 1)) {
        errors.push('maxDuration debe ser un número mayor a 0');
    }
    
    if (classData.status) {
        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(classData.status)) {
            errors.push(`status debe ser uno de: ${validStatuses.join(', ')}`);
        }
    }
    
    // Validar que end sea después de start
    if (classData.start && classData.end) {
        const startDate = new Date(classData.start);
        const endDate = new Date(classData.end);
        if (endDate <= startDate) {
            errors.push('end debe ser posterior a start');
        }
        
        // Validar duración mínima (15 minutos)
        const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
        if (durationMinutes < 15) {
            errors.push('La duración mínima de la clase debe ser 15 minutos');
        }
    }
    
    // Validar estudiantes si se proporcionan
    if (classData.students && Array.isArray(classData.students)) {
        for (let i = 0; i < classData.students.length; i++) {
            const student = classData.students[i];
            if (!student.id) {
                errors.push(`students[${i}].id es requerido`);
            } else if (!mongoose.Types.ObjectId.isValid(student.id)) {
                errors.push(`students[${i}].id debe ser un ObjectId válido`);
            }
            if (!student.name) {
                errors.push(`students[${i}].name es requerido`);
            }
        }
        
        // Validar que no exceda maxStudents
        if (classData.maxStudents && classData.students.length > classData.maxStudents) {
            errors.push('El número de estudiantes no puede exceder maxStudents');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

export const prepareAvailableClassData = (classData: any) => {
    return {
        ...classData,
        start: classData.start ? new Date(classData.start) : undefined,
        end: classData.end ? new Date(classData.end) : undefined,
        price: classData.price ? Number(classData.price) : undefined,
        maxStudents: classData.maxStudents ? Number(classData.maxStudents) : undefined,
        maxDuration: classData.maxDuration ? Number(classData.maxDuration) : undefined,
        groupClass: Boolean(classData.groupClass)
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

// Función para validar datos de inscripción de estudiante
export const validateStudentEnrollment = (enrollmentData: any): AvailableClassValidationResult => {
    const errors: string[] = [];
    
    if (!enrollmentData.studentId) {
        errors.push('studentId es requerido');
    } else if (!mongoose.Types.ObjectId.isValid(enrollmentData.studentId)) {
        errors.push('studentId debe ser un ObjectId válido');
    }
    
    if (!enrollmentData.studentName) {
        errors.push('studentName es requerido');
    } else if (enrollmentData.studentName.length < 2) {
        errors.push('studentName debe tener al menos 2 caracteres');
    }
    
    if (enrollmentData.studentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollmentData.studentEmail)) {
        errors.push('studentEmail debe ser un email válido');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};
