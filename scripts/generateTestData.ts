// Cargar variables de entorno primero
import dotenv from 'dotenv';
import path from 'path';

// Cargar .env desde la raíz del proyecto (process.cwd() apunta a la raíz)
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import { connect } from '../dataBase/db';
import { CalendarEvent, Offer, PastSession } from '../models';
import User from '../models/users';

// Función para generar fechas aleatorias
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Función para generar horas aleatorias
function randomTime(): string {
  const hours = Math.floor(Math.random() * 12) + 8; // Entre 8:00 y 19:00
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

async function generateTestData() {
  try {
    // Verificar que MONGO_URL esté definida
    if (!process.env.MONGO_URL) {
      console.error('❌ Error: MONGO_URL no está definida en las variables de entorno');
      console.error('   Asegúrate de tener un archivo .env en la raíz del proyecto con:');
      console.error('   MONGO_URL=mongodb://localhost:27017/tu-base-de-datos');
      console.error('   o');
      console.error('   MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/tu-base-de-datos');
      process.exit(1);
    }

    console.log('🔌 Conectando a la base de datos...');
    await connect();
    console.log('✅ Conectado a la base de datos');

    // Obtener o crear usuarios de prueba
    let users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log('⚠️ No se encontraron usuarios. Creando usuarios de prueba...');
      const testUsers = [
        {
          fullName: 'Prof. Juan Pérez',
          email: 'juan.profesor@test.com',
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
          bornDate: new Date('1985-01-15'),
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
          description: 'Profesor de matemáticas y física con 10 años de experiencia',
          rating: 4.8,
          country: 'España',
          residence: 'Madrid'
        },
        {
          fullName: 'Prof. María García',
          email: 'maria.profesora@test.com',
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
          bornDate: new Date('1990-03-20'),
          image: 'https://randomuser.me/api/portraits/women/2.jpg',
          description: 'Especialista en programación y desarrollo web',
          rating: 4.9,
          country: 'España',
          residence: 'Barcelona'
        },
        {
          fullName: 'Prof. Carlos López',
          email: 'carlos.profesor@test.com',
          password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
          bornDate: new Date('1988-07-10'),
          image: 'https://randomuser.me/api/portraits/men/3.jpg',
          description: 'Experto en idiomas y literatura',
          rating: 4.7,
          country: 'México',
          residence: 'Ciudad de México'
        }
      ];
      
      users = await User.insertMany(testUsers);
      console.log(`✅ Creados ${users.length} usuarios de prueba`);
    }

    // Datos de prueba para Clases Disponibles (CalendarEvent)
    const availableClassesData = [
      {
        userId: users[0]._id,
        title: 'Clase de Cálculo Diferencial',
        description: 'Aprende los fundamentos del cálculo diferencial desde cero. Ideal para estudiantes de ingeniería.',
        start: new Date('2025-02-15T10:00:00Z'),
        end: new Date('2025-02-15T12:00:00Z'),
        color: '#FFE5E5',
        type: 'disponibilidad' as const,
        price: 45,
        level: 'Principiante',
        topic: 'Matemáticas',
        maxStudents: 5,
        groupClass: true,
        maxDuration: 120,
        location: 'Online',
        status: 'pending' as const
      },
      {
        userId: users[0]._id,
        title: 'Tutoría de Física Cuántica',
        description: 'Sesión individual de física cuántica para estudiantes avanzados.',
        start: new Date('2025-02-16T14:00:00Z'),
        end: new Date('2025-02-16T15:30:00Z'),
        color: '#E5FFE5',
        type: 'agendadas' as const,
        price: 60,
        level: 'Avanzado',
        topic: 'Física',
        maxStudents: 1,
        groupClass: false,
        maxDuration: 90,
        location: 'Presencial - Madrid',
        status: 'confirmed' as const,
        students: [{
          id: users[1]._id,
          name: users[1].fullName,
          email: users[1].email
        }]
      },
      {
        userId: users[1]._id,
        title: 'Curso de React y Next.js',
        description: 'Aprende a construir aplicaciones web modernas con React y Next.js. Incluye proyectos prácticos.',
        start: new Date('2025-02-17T09:00:00Z'),
        end: new Date('2025-02-17T11:00:00Z'),
        color: '#E5E5FF',
        type: 'ofertas' as const,
        price: 50,
        level: 'Intermedio',
        topic: 'Programación',
        maxStudents: 8,
        groupClass: true,
        maxDuration: 120,
        location: 'Online',
        status: 'pending' as const
      },
      {
        userId: users[1]._id,
        title: 'Workshop de TypeScript',
        description: 'Workshop intensivo sobre TypeScript para desarrolladores JavaScript.',
        start: new Date('2025-02-18T16:00:00Z'),
        end: new Date('2025-02-18T18:00:00Z'),
        color: '#FFE5FF',
        type: 'recibir' as const,
        price: 40,
        level: 'Intermedio',
        topic: 'Programación',
        maxStudents: 6,
        groupClass: true,
        maxDuration: 120,
        location: 'Online',
        status: 'pending' as const
      },
      {
        userId: users[2]._id,
        title: 'Clase de Inglés Conversacional',
        description: 'Mejora tu inglés hablado con sesiones de conversación práctica.',
        start: new Date('2025-02-19T10:00:00Z'),
        end: new Date('2025-02-19T11:00:00Z'),
        color: '#FFE5E5',
        type: 'disponibilidad' as const,
        price: 35,
        level: 'Principiante',
        topic: 'Idiomas',
        maxStudents: 4,
        groupClass: true,
        maxDuration: 60,
        location: 'Online',
        status: 'pending' as const
      },
      {
        userId: users[2]._id,
        title: 'Preparación para IELTS',
        description: 'Clase especializada en preparación para el examen IELTS.',
        start: new Date('2025-02-20T15:00:00Z'),
        end: new Date('2025-02-20T17:00:00Z'),
        color: '#E5FFE5',
        type: 'agendadas' as const,
        price: 55,
        level: 'Avanzado',
        topic: 'Idiomas',
        maxStudents: 3,
        groupClass: true,
        maxDuration: 120,
        location: 'Online',
        status: 'confirmed' as const
      }
    ];

    // Datos de prueba para Ofertas (Offer)
    const offersData = [
      {
        userId: users[0]._id,
        name: 'Curso Intensivo de Álgebra Lineal',
        topic: 'matemáticas',
        startDate: new Date('2025-03-01T09:00:00Z'),
        endDate: new Date('2025-03-15T18:00:00Z'),
        startTime: '09:00',
        endTime: '11:00',
        avatar: users[0].image,
        coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        price: 299,
        currency: 'EUR',
        rating: 4.8,
        timeSlot: '120',
        description: 'Curso completo de álgebra lineal con ejercicios prácticos y material de apoyo.',
        level: 'Intermedio',
        duration: 120,
        maxStudents: 10,
        location: 'Online',
        requirements: ['Conocimientos básicos de álgebra', 'Calculadora científica'],
        materials: ['Libro de texto recomendado', 'Calculadora', 'Cuaderno de ejercicios'],
        status: 'active' as const
      },
      {
        userId: users[1]._id,
        name: 'Bootcamp de Desarrollo Full Stack',
        topic: 'programación',
        startDate: new Date('2025-03-05T10:00:00Z'),
        endDate: new Date('2025-04-30T18:00:00Z'),
        startTime: '10:00',
        endTime: '13:00',
        avatar: users[1].image,
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        price: 599,
        currency: 'EUR',
        rating: 4.9,
        timeSlot: '180',
        description: 'Bootcamp completo de desarrollo full stack con React, Node.js y bases de datos.',
        level: 'Principiante',
        duration: 180,
        maxStudents: 15,
        location: 'Online',
        requirements: ['Conocimientos básicos de programación', 'Computadora con acceso a internet'],
        materials: ['Editor de código (VS Code)', 'Node.js instalado', 'Git configurado'],
        status: 'active' as const
      },
      {
        userId: users[1]._id,
        name: 'Masterclass de Python Avanzado',
        topic: 'programación',
        startDate: new Date('2025-02-25T14:00:00Z'),
        endDate: new Date('2025-03-10T16:00:00Z'),
        startTime: '14:00',
        endTime: '16:00',
        avatar: users[1].image,
        coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfe20?w=800',
        price: 199,
        currency: 'EUR',
        rating: 4.7,
        timeSlot: '120',
        description: 'Aprende técnicas avanzadas de Python incluyendo decoradores, generadores y programación asíncrona.',
        level: 'Avanzado',
        duration: 120,
        maxStudents: 8,
        location: 'Online',
        requirements: ['Python 3.8+ instalado', 'Conocimientos sólidos de Python básico'],
        materials: ['IDE Python (PyCharm o VS Code)', 'Jupyter Notebook'],
        status: 'active' as const
      },
      {
        userId: users[2]._id,
        name: 'Curso de Inglés para Negocios',
        topic: 'idiomas',
        startDate: new Date('2025-03-10T18:00:00Z'),
        endDate: new Date('2025-04-10T20:00:00Z'),
        startTime: '18:00',
        endTime: '19:30',
        avatar: users[2].image,
        coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
        price: 249,
        currency: 'EUR',
        rating: 4.6,
        timeSlot: '90',
        description: 'Curso especializado en inglés para entornos profesionales y de negocios.',
        level: 'Intermedio',
        duration: 90,
        maxStudents: 12,
        location: 'Online',
        requirements: ['Nivel intermedio de inglés', 'Dispositivo con cámara y micrófono'],
        materials: ['Material de lectura proporcionado', 'Diccionario inglés-español'],
        status: 'active' as const
      },
      {
        userId: users[0]._id,
        name: 'Tutoría de Cálculo Integral',
        topic: 'matemáticas',
        startDate: new Date('2025-02-22T16:00:00Z'),
        endDate: new Date('2025-02-22T17:30:00Z'),
        startTime: '16:00',
        endTime: '17:30',
        avatar: users[0].image,
        price: 50,
        currency: 'EUR',
        rating: 4.8,
        timeSlot: '90',
        description: 'Sesión individual de cálculo integral con enfoque en problemas prácticos.',
        level: 'Intermedio',
        duration: 90,
        maxStudents: 1,
        location: 'Online',
        requirements: ['Conocimientos de cálculo diferencial'],
        materials: ['Calculadora científica', 'Cuaderno de ejercicios'],
        status: 'active' as const
      }
    ];

    // Datos de prueba para Sesiones Pasadas (PastSession)
    const pastSessionsData = [
      {
        eventId: new mongoose.Types.ObjectId(),
        userId: users[0]._id,
        name: 'Introducción al Cálculo',
        topic: 'matemáticas',
        date: new Date('2025-01-15T10:00:00Z'),
        time: '10:00',
        level: 'Principiante',
        price: 45,
        location: 'Online',
        duration: 120,
        notes: 'Cubrimos límites y continuidad. Los estudiantes mostraron buen progreso.',
        rating: 5,
        feedback: 'Excelente sesión, explicaciones muy claras y ejercicios prácticos útiles.',
        attachments: [
          {
            id: 'att1',
            name: 'ejercicios_limites.pdf',
            type: 'pdf' as const,
            url: 'https://example.com/uploads/ejercicios_limites.pdf',
            size: 245678,
            uploadedAt: new Date('2025-01-15T10:30:00Z')
          },
          {
            id: 'att2',
            name: 'formulas_calculo.png',
            type: 'image' as const,
            url: 'https://example.com/uploads/formulas_calculo.png',
            size: 156789,
            uploadedAt: new Date('2025-01-15T10:35:00Z')
          }
        ]
      },
      {
        eventId: new mongoose.Types.ObjectId(),
        userId: users[1]._id,
        name: 'Fundamentos de React',
        topic: 'programación',
        date: new Date('2025-01-20T14:00:00Z'),
        time: '14:00',
        level: 'Principiante',
        price: 50,
        location: 'Online',
        duration: 120,
        notes: 'Introducción a componentes, props y estado. Proyecto práctico incluido.',
        rating: 4,
        feedback: 'Buen curso, pero necesitaría más ejemplos prácticos.',
        attachments: [
          {
            id: 'att3',
            name: 'proyecto_react.zip',
            type: 'document' as const,
            url: 'https://example.com/uploads/proyecto_react.zip',
            size: 1024567,
            uploadedAt: new Date('2025-01-20T15:00:00Z')
          }
        ]
      },
      {
        eventId: new mongoose.Types.ObjectId(),
        userId: users[2]._id,
        name: 'Inglés Conversacional - Nivel Intermedio',
        topic: 'idiomas',
        date: new Date('2025-01-18T18:00:00Z'),
        time: '18:00',
        level: 'Intermedio',
        price: 35,
        location: 'Online',
        duration: 60,
        notes: 'Sesión de conversación sobre temas de actualidad. Participación activa de todos.',
        rating: 5,
        feedback: 'Muy dinámica y entretenida. Me ayudó mucho con mi fluidez.',
        attachments: [
          {
            id: 'att4',
            name: 'vocabulario_tema.pdf',
            type: 'pdf' as const,
            url: 'https://example.com/uploads/vocabulario_tema.pdf',
            size: 98765,
            uploadedAt: new Date('2025-01-18T18:30:00Z')
          }
        ]
      },
      {
        eventId: new mongoose.Types.ObjectId(),
        userId: users[0]._id,
        name: 'Física Mecánica - Movimiento Circular',
        topic: 'física',
        date: new Date('2025-01-25T11:00:00Z'),
        time: '11:00',
        level: 'Intermedio',
        price: 55,
        location: 'Online',
        duration: 90,
        notes: 'Explicación de movimiento circular uniforme y no uniforme con ejemplos.',
        rating: 4,
        feedback: 'Buen contenido, pero el ritmo fue un poco rápido.',
        attachments: [
          {
            id: 'att5',
            name: 'problemas_movimiento.xlsx',
            type: 'excel' as const,
            url: 'https://example.com/uploads/problemas_movimiento.xlsx',
            size: 45678,
            uploadedAt: new Date('2025-01-25T11:45:00Z')
          },
          {
            id: 'att6',
            name: 'diagrama_movimiento.png',
            type: 'image' as const,
            url: 'https://example.com/uploads/diagrama_movimiento.png',
            size: 234567,
            uploadedAt: new Date('2025-01-25T12:00:00Z')
          }
        ]
      },
      {
        eventId: new mongoose.Types.ObjectId(),
        userId: users[1]._id,
        name: 'Node.js y Express - API REST',
        topic: 'programación',
        date: new Date('2025-02-01T16:00:00Z'),
        time: '16:00',
        level: 'Intermedio',
        price: 60,
        location: 'Online',
        duration: 180,
        notes: 'Construcción de API REST completa con autenticación JWT.',
        rating: 5,
        feedback: 'Excelente, muy completo y bien estructurado. Aprendí mucho.',
        attachments: [
          {
            id: 'att7',
            name: 'api_ejemplo.zip',
            type: 'document' as const,
            url: 'https://example.com/uploads/api_ejemplo.zip',
            size: 2048576,
            uploadedAt: new Date('2025-02-01T17:00:00Z')
          },
          {
            id: 'att8',
            name: 'documentacion_api.pdf',
            type: 'pdf' as const,
            url: 'https://example.com/uploads/documentacion_api.pdf',
            size: 345678,
            uploadedAt: new Date('2025-02-01T17:15:00Z')
          }
        ]
      },
      {
        eventId: new mongoose.Types.ObjectId(),
        userId: users[2]._id,
        name: 'Preparación IELTS - Writing Task 2',
        topic: 'idiomas',
        date: new Date('2025-02-05T19:00:00Z'),
        time: '19:00',
        level: 'Avanzado',
        price: 40,
        location: 'Online',
        duration: 90,
        notes: 'Enfoque en estructura de ensayos y vocabulario académico.',
        rating: 5,
        feedback: 'Muy útil para mejorar mi escritura académica.',
        attachments: [
          {
            id: 'att9',
            name: 'plantilla_ensayo.pdf',
            type: 'pdf' as const,
            url: 'https://example.com/uploads/plantilla_ensayo.pdf',
            size: 123456,
            uploadedAt: new Date('2025-02-05T19:30:00Z')
          }
        ]
      }
    ];

    // Insertar datos
    console.log('\n📚 Insertando Clases Disponibles...');
    const createdClasses = await CalendarEvent.insertMany(availableClassesData);
    console.log(`✅ Creadas ${createdClasses.length} clases disponibles`);

    console.log('\n💼 Insertando Ofertas...');
    const createdOffers = await Offer.insertMany(offersData);
    console.log(`✅ Creadas ${createdOffers.length} ofertas`);

    console.log('\n📖 Insertando Sesiones Pasadas...');
    const createdSessions = await PastSession.insertMany(pastSessionsData);
    console.log(`✅ Creadas ${createdSessions.length} sesiones pasadas`);

    // Mostrar resumen
    console.log('\n📊 Resumen de datos creados:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Clases Disponibles: ${createdClasses.length}`);
    createdClasses.forEach((cls, idx) => {
      console.log(`  ${idx + 1}. ${cls.title} (${cls.type}) - ${cls.status}`);
    });
    
    console.log(`\nOfertas: ${createdOffers.length}`);
    createdOffers.forEach((offer, idx) => {
      console.log(`  ${idx + 1}. ${offer.name} - ${offer.price} ${offer.currency}`);
    });
    
    console.log(`\nSesiones Pasadas: ${createdSessions.length}`);
    createdSessions.forEach((session, idx) => {
      console.log(`  ${idx + 1}. ${session.name} - Rating: ${session.rating}/5`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('✅ Datos de prueba generados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al generar datos de prueba:', error);
    process.exit(1);
  }
}

generateTestData();

