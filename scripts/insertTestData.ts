import mongoose from 'mongoose';
import { connect } from '../dataBase/db';
import User from '../models/users';
import Offer from '../models/offers';
import PastSession from '../models/pastSessions';
import Review from '../models/reviews';

async function insertTestData() {
  try {
    await connect();

    // Crear usuario profesor de prueba
    const testUser = await User.create({
      fullName: 'Juan Pérez',
      email: 'juan@test.com',
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
      bornDate: new Date('1985-01-01'),
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: 'Profesor de matemáticas con 10 años de experiencia',
      rating: 4.8,
      country: 'España',
      residence: 'Madrid',
      experiences: ['10 años enseñando matemáticas', 'Doctorado en Matemáticas Aplicadas'],
      skills: ['Cálculo', 'Álgebra', 'Estadística'],
      interests: ['Educación', 'Matemáticas', 'Tecnología'],
      followers: [],
      following: [],
      userGroups: []
    });

    // Crear oferta de prueba
    const testOffer = await Offer.create({
      userId: testUser._id,
      name: 'Clase de Cálculo Avanzado',
      topic: 'matemáticas',
      startDate: new Date('2025-10-15T10:00:00Z'),
      endDate: new Date('2025-10-15T11:30:00Z'),
      startTime: '10:00',
      endTime: '11:30',
      avatar: testUser.image, // Using user's image as avatar
      price: 35,
      currency: 'EUR',
      rating: 4.8,
      timeSlot: '90',
      description: 'Clase particular de cálculo diferencial e integral',
      level: 'avanzado',
      duration: 90,
      maxStudents: 1,
      location: 'online',
      requirements: ['Conocimientos básicos de cálculo'],
      materials: ['Calculadora científica'],
      status: 'active'
    });

    // Crear sesión pasada de prueba
    const testSession = await PastSession.create({
      eventId: new mongoose.Types.ObjectId(),
      userId: testUser._id,
      name: 'Introducción al Cálculo',
      topic: 'matemáticas',
      date: new Date('2025-10-10T15:00:00Z'),
      time: '15:00',
      level: 'intermedio',
      price: 30,
      location: 'online',
      duration: 60,
      notes: 'Cubrimos derivadas y límites',
      rating: 5,
      feedback: 'Excelente sesión, muy productiva',
      attachments: [{
        id: 'att1',
        name: 'notas_calculo.pdf',
        type: 'pdf',
        url: '/uploads/notas_calculo.pdf',
        size: 1024576,
        uploadedAt: new Date()
      }]
    });

    // Crear usuario estudiante de prueba
    const studentUser = await User.create({
      fullName: 'María García',
      email: 'maria@test.com',
      password: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
      bornDate: new Date('2000-05-15'),
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      description: 'Estudiante de ingeniería',
      rating: 5,
      country: 'España',
      residence: 'Barcelona',
      experiences: ['Estudiante universitaria'],
      skills: ['Programación básica'],
      interests: ['Matemáticas', 'Física', 'Programación'],
      followers: [],
      following: [],
      userGroups: []
    });

    // Crear reseña de prueba
    const testReview = await Review.create({
      reviewerId: studentUser._id,
      targetId: testUser._id,
      eventId: testSession._id,
      rating: 5,
      comment: 'Excelente profesor, explicaciones muy claras',
      date: new Date('2025-10-10T16:00:00Z')
    });

    console.log('Datos de prueba insertados exitosamente');
    console.log('ID Usuario Profesor:', testUser._id.toString());
    console.log('ID Usuario Estudiante:', studentUser._id.toString());
    console.log('ID Oferta:', testOffer._id.toString());
    console.log('ID Sesión:', testSession._id.toString());
    console.log('ID Reseña:', testReview._id.toString());

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    process.exit(1);
  }
}

insertTestData();