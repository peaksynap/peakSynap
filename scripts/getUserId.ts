import mongoose from 'mongoose';
import { User } from '../models';

// Conectar a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/peaksynap');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Función para obtener un userId válido
const getUserId = async () => {
    try {
        const user = await User.findOne({});
        if (user) {
            console.log('Usuario encontrado:');
            console.log('ID:', user._id);
            console.log('Nombre:', user.fullName);
            console.log('Email:', user.email);
            return user._id;
        } else {
            console.log('No se encontraron usuarios en la base de datos');
            return null;
        }
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
};

// Función principal
const main = async () => {
    await connectDB();
    const userId = await getUserId();
    
    if (userId) {
        console.log('\n--- Ejemplo de evento con userId válido ---');
        console.log(JSON.stringify({
            userId: userId.toString(),
            title: "Sesión de Matemáticas",
            description: "Clase de álgebra lineal",
            start: "2024-12-20T10:00:00.000Z",
            end: "2024-12-20T11:30:00.000Z",
            color: "#3498db",
            type: "agendadas",
            price: 50,
            level: "universitario",
            topic: "Álgebra Lineal",
            maxStudents: 10,
            groupClass: true,
            maxDuration: 90,
            location: "Aula 101",
            status: "pending"
        }, null, 2));
    }
    
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
};

// Ejecutar si se llama directamente
if (require.main === module) {
    main().catch(console.error);
}

export { getUserId };
