import mongoose from 'mongoose';
import User from '../models/users';
import CalendarEvent from '../models/events';
import Review from '../models/reviews';
import Offer from '../models/offers';
import { config } from 'dotenv';
import path from 'path';

// Cargar variables de entorno
config({ path: path.resolve(__dirname, '../.env') });

const TARGET_USER_ID = '68ce0291c4f5d1435816d910';

async function createTestData() {
    try {
        // Conectar a MongoDB
        // Usar lowercase para evitar conflictos de case
        const mongoUrl = 'mongodb://localhost:27017/peaksynap';
        await mongoose.connect(mongoUrl);
        console.log('✓ Conectado a la base de datos:', mongoUrl);

        // Limpiar datos existentes (opcional - comentar si quieres mantener datos)
        // await User.deleteMany({});
        // await CalendarEvent.deleteMany({});
        // await Review.deleteMany({});

        // 1. Crear usuarios de prueba
        console.log('\n📝 Creando usuarios de prueba...');
        
        const usersData = [
            {
                fullName: 'María García López',
                email: 'maria.garcia@example.com',
                password: 'password123',
                bornDate: new Date('1990-05-15'),
                gender: 'F',
                country: 'España',
                residence: 'Madrid, España',
                image: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=ff6b6b&color=fff',
                description: 'Profesora de matemáticas con especialización en álgebra y cálculo diferencial',
                rating: 4.8,
                topic: 'Matemáticas',
                skills: ['Álgebra', 'Cálculo', 'Geometría', 'Estadística'],
                experiences: ['5 años enseñando', 'Universidad Complutense', 'Escuela Secundaria'],
                languages: ['Español', 'Inglés'],
                education: 'Licenciada en Matemáticas',
                isOnline: true,
                isInPerson: true,
                isHybrid: true,
                individualPricing: 40,
                groupPricing: 25,
                pricingCurrency: 'EUR'
            },
            {
                fullName: 'Carlos Rodríguez Martín',
                email: 'carlos.rodriguez@example.com',
                password: 'password123',
                bornDate: new Date('1985-08-20'),
                gender: 'M',
                country: 'España',
                residence: 'Barcelona, España',
                image: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=4ecdc4&color=fff',
                description: 'Profesor de física cuántica y mecánica',
                rating: 4.9,
                topic: 'Física',
                skills: ['Física Cuántica', 'Mecánica', 'Óptica', 'Termodinámica'],
                experiences: ['8 años enseñando', 'Universidad de Barcelona'],
                languages: ['Español', 'Catalán', 'Inglés'],
                education: 'Doctor en Física',
                isOnline: true,
                isInPerson: false,
                isHybrid: false,
                individualPricing: 50,
                groupPricing: 30,
                pricingCurrency: 'EUR'
            },
            {
                fullName: 'Ana Martínez Sánchez',
                email: 'ana.martinez@example.com',
                password: 'password123',
                bornDate: new Date('1992-03-10'),
                gender: 'F',
                country: 'España',
                residence: 'Valencia, España',
                image: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=95e1d3&color=fff',
                description: 'Profesora de idiomas: inglés, francés y alemán',
                rating: 4.7,
                topic: 'Idiomas',
                skills: ['Inglés', 'Francés', 'Alemán'],
                experiences: ['3 años enseñando', 'Centro de idiomas'],
                languages: ['Español', 'Inglés', 'Francés', 'Alemán'],
                education: 'Licenciada en Filología Inglesa',
                isOnline: true,
                isInPerson: true,
                isHybrid: true,
                individualPricing: 35,
                groupPricing: 20,
                pricingCurrency: 'EUR'
            },
            {
                fullName: 'Pedro Hernández Díaz',
                email: 'pedro.hernandez@example.com',
                password: 'password123',
                bornDate: new Date('1988-11-25'),
                gender: 'M',
                country: 'España',
                residence: 'Sevilla, España',
                image: 'https://ui-avatars.com/api/?name=Pedro+Hernandez&background=a8e6cf&color=fff',
                description: 'Profesor de programación y desarrollo web',
                rating: 5.0,
                topic: 'Programación',
                skills: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'],
                experiences: ['7 años enseñando', 'Bootcamp Tecnológico'],
                languages: ['Español', 'Inglés'],
                education: 'Ingeniero en Informática',
                isOnline: true,
                isInPerson: false,
                isHybrid: false,
                individualPricing: 45,
                groupPricing: 28,
                pricingCurrency: 'EUR'
            }
        ];

        const createdUsers = [];
        for (const userData of usersData) {
            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`  ⏭️  Usuario ${userData.fullName} ya existe`);
                createdUsers.push(existingUser);
            } else {
                const user = new User(userData);
                const savedUser = await user.save();
                console.log(`  ✓ Usuario creado: ${savedUser.fullName} (${savedUser._id})`);
                createdUsers.push(savedUser);
            }
        }

        // Verificar si existe el usuario objetivo
        const targetUser = await User.findById(TARGET_USER_ID);
        if (!targetUser) {
            console.log(`\n❌ Usuario objetivo (${TARGET_USER_ID}) no existe`);
            return;
        }
        console.log(`\n✓ Usuario objetivo encontrado: ${targetUser.fullName}`);

        // 2. Crear eventos de diferentes tipos
        console.log('\n📅 Creando eventos de prueba...');
        
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Función para crear fecha aleatoria en los próximos 30 días
        const randomDate = (daysFromNow: number) => {
            const date = new Date(now);
            date.setDate(date.getDate() + daysFromNow);
            return date;
        };

        const eventTypes = {
            'disponibilidad': { color: '#FFE5E5', status: 'pending' },
            'agendadas': { color: '#E5FFE5', status: 'confirmed' },
            'ofertas': { color: '#E5E5FF', status: 'pending' },
            'recibir': { color: '#FFE5FF', status: 'pending' }
        };

        // Eventos del usuario objetivo como profesor
        const targetUserEventsData = [
            {
                userId: TARGET_USER_ID,
                title: 'Clase de Disponibilidad - Álgebra',
                description: 'Horario disponible para clases particulares de álgebra',
                start: randomDate(2),
                end: randomDate(2),
                type: 'disponibilidad',
                color: eventTypes.disponibilidad.color,
                status: eventTypes.disponibilidad.status,
                price: 40,
                level: 'Intermedio',
                topic: 'Matemáticas',
                maxStudents: 5,
                groupClass: true,
                maxDuration: 60,
                location: 'Online'
            },
            {
                userId: TARGET_USER_ID,
                title: 'Clase Agendada - Cálculo Diferencial',
                description: 'Clase confirmada sobre derivadas y límites',
                start: randomDate(5),
                end: randomDate(5),
                type: 'agendadas',
                color: eventTypes.agendadas.color,
                status: eventTypes.agendadas.status,
                price: 40,
                level: 'Avanzado',
                topic: 'Matemáticas',
                maxStudents: 3,
                groupClass: false,
                maxDuration: 90,
                location: 'Online'
            },
            {
                userId: TARGET_USER_ID,
                title: 'Oferta de Clases Grupales',
                description: 'Curso completo de geometría analítica',
                start: randomDate(7),
                end: randomDate(21),
                type: 'ofertas',
                color: eventTypes.ofertas.color,
                status: eventTypes.ofertas.status,
                price: 25,
                level: 'Principiante',
                topic: 'Matemáticas',
                maxStudents: 8,
                groupClass: true,
                maxDuration: 60,
                location: 'Online'
            }
        ];

        const savedTargetEvents = [];
        for (const eventData of targetUserEventsData) {
            const event = new CalendarEvent(eventData);
            const savedEvent = await event.save();
            savedTargetEvents.push(savedEvent);
            console.log(`  ✓ Evento creado: ${savedEvent.title} (${savedEvent._id})`);
        }

        // Eventos de otros usuarios
        const eventsForOtherUsers = [];
        
        for (const user of createdUsers) {
            const userEvent = {
                userId: user._id.toString(),
                title: `Clase ${user.fullName.split(' ')[0]} - ${user.topic}`,
                description: `Clase sobre ${user.topic} con ${user.fullName}`,
                start: randomDate(3),
                end: randomDate(3),
                type: 'agendadas',
                color: eventTypes.agendadas.color,
                status: eventTypes.agendadas.status,
                price: user.individualPricing || 35,
                level: 'Intermedio',
                topic: user.topic,
                maxStudents: 5,
                groupClass: true,
                maxDuration: 60,
                location: 'Online'
            };
            eventsForOtherUsers.push(userEvent);
        }

        // Crear eventos de otros usuarios
        const savedOtherEvents = [];
        for (const eventData of eventsForOtherUsers) {
            const event = new CalendarEvent(eventData);
            const savedEvent = await event.save();
            savedOtherEvents.push(savedEvent);
            console.log(`  ✓ Evento creado: ${savedEvent.title} (${savedEvent._id})`);
        }

        // 3. Agregar al usuario objetivo como estudiante en eventos de otros usuarios
        console.log('\n👨‍🎓 Inscribiendo usuario objetivo en eventos de otros usuarios...');
        
        for (let i = 0; i < Math.min(3, savedOtherEvents.length); i++) {
            const event = savedOtherEvents[i];
            
            // Verificar si ya está inscrito
            const isAlreadyEnrolled = event.students.some(
                (s: any) => s.id?.toString() === TARGET_USER_ID
            );

            if (!isAlreadyEnrolled) {
                event.students.push({
                    id: TARGET_USER_ID,
                    name: targetUser.fullName,
                    email: targetUser.email
                });
                await event.save();
                console.log(`  ✓ Inscrito en: ${event.title}`);
            }
        }

        // 4. Crear reviews para el usuario objetivo
        console.log('\n⭐ Creando reviews para el usuario objetivo...');
        
        const reviewData = [
            {
                reviewerId: createdUsers[0]._id.toString(),
                targetId: TARGET_USER_ID,
                eventId: savedTargetEvents[0]._id.toString(),
                rating: 5,
                comment: 'Excelente profesor, muy claro en sus explicaciones. Altamente recomendado.',
                date: new Date()
            },
            {
                reviewerId: createdUsers[1]._id.toString(),
                targetId: TARGET_USER_ID,
                eventId: savedTargetEvents[0]._id.toString(),
                rating: 4,
                comment: 'Muy buen maestro, aunque algunos temas podrían explicarse más despacio.',
                date: new Date()
            },
            {
                reviewerId: createdUsers[2]._id.toString(),
                targetId: TARGET_USER_ID,
                eventId: savedTargetEvents[1]._id.toString(),
                rating: 5,
                comment: 'Increíble método de enseñanza. Las clases son muy interactivas.',
                date: new Date()
            }
        ];

        for (const reviewDataItem of reviewData) {
            // Verificar si ya existe la review
            const existingReview = await Review.findOne({
                reviewerId: reviewDataItem.reviewerId,
                targetId: reviewDataItem.targetId,
                eventId: reviewDataItem.eventId
            });

            if (!existingReview) {
                const review = new Review(reviewDataItem);
                await review.save();
                console.log(`  ✓ Review creada: ${reviewDataItem.rating} estrellas`);
            }
        }

        console.log('\n✅ Datos de prueba creados exitosamente!');
        console.log(`\n📊 Resumen:`);
        console.log(`   - Usuarios creados: ${createdUsers.length}`);
        console.log(`   - Eventos del usuario objetivo como profesor: ${savedTargetEvents.length}`);
        console.log(`   - Eventos donde el usuario objetivo es estudiante: ${Math.min(3, savedOtherEvents.length)}`);
        console.log(`   - Reviews del usuario objetivo: ${reviewData.length}`);
        console.log('\n💼 Creando ofertas para los otros usuarios...');
        
        const offersData = [];
        for (let i = 0; i < createdUsers.length; i++) {
            const user = createdUsers[i];
            const startDate = randomDate(1);
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + 1);
            
            offersData.push({
                userId: user._id.toString(),
                name: `${user.topic} - ${user.fullName.split(' ')[0]}`,
                topic: user.topic,
                startDate: startDate,
                endDate: endDate,
                startTime: '10:00',
                endTime: '11:00',
                avatar: user.image || 'https://ui-avatars.com/api/?name=User',
                coverImage: '',
                price: user.individualPricing || 35,
                currency: user.pricingCurrency || 'EUR',
                rating: user.rating,
                timeSlot: 'Morning',
                description: `Clase de ${user.topic} con ${user.fullName}`,
                level: 'Intermedio',
                duration: 60,
                maxStudents: 8,
                location: 'Online',
                requirements: ['Computadora', 'Internet estable'],
                materials: ['Cuaderno', 'Lápiz'],
                status: 'active'
            });
        }

        const savedOffers = [];
        for (const offerData of offersData) {
            const offer = new Offer(offerData);
            const savedOffer = await offer.save();
            savedOffers.push(savedOffer);
            console.log(`  ✓ Oferta creada: ${savedOffer.name} (${savedOffer._id})`);
        }

        console.log(`\n🎯 ID del usuario objetivo: ${TARGET_USER_ID}`);
        console.log(`   Endpoint para perfil: GET /api/users/${TARGET_USER_ID}`);
        console.log(`\n💼 Ofertas disponibles:`);
        console.log(`   GET /api/offers/available`);
        console.log(`   Se han creado ${savedOffers.length} ofertas`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('\n✓ Conexión cerrada');
        }
    }
}

// Ejecutar el script
createTestData();

